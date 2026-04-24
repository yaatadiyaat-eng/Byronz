package ai.byronz.app;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.annotation.Nullable;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

@CapacitorPlugin(name = "ByronzAppUpdate")
public class ByronzAppUpdatePlugin extends Plugin {

    private static final int UPDATE_REQUEST_CODE = 10824;
    private static final String UPDATE_EVENT = "updateStateChanged";
    private static final String UPDATE_ERROR_PREFIX = "Gagal memeriksa update Android";

    private AppUpdateManager appUpdateManager;
    private InstallStateUpdatedListener installStateUpdatedListener;

    @Override
    public void load() {
        appUpdateManager = AppUpdateManagerFactory.create(getContext());
        installStateUpdatedListener = state -> {
            notifyListeners(UPDATE_EVENT, createInstallStatePayload(state), true);

            if (state.installStatus() == InstallStatus.DOWNLOADED) {
                notifyLatestInfo(false, false);
            }
        };
        appUpdateManager.registerListener(installStateUpdatedListener);
    }

    @Override
    protected void handleOnResume() {
        notifyLatestInfo(false, true);
    }

    @Override
    protected void handleOnDestroy() {
        if (appUpdateManager != null && installStateUpdatedListener != null) {
            appUpdateManager.unregisterListener(installStateUpdatedListener);
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != UPDATE_REQUEST_CODE) {
            return;
        }

        JSObject payload = new JSObject();
        payload.put("event", "flowResult");
        payload.put("resultCode", resultCode);
        payload.put("flowResult", mapFlowResult(resultCode));
        notifyListeners(UPDATE_EVENT, payload, true);
        notifyLatestInfo(false, false);
    }

    @PluginMethod
    public void getInfo(PluginCall call) {
        resolveLatestInfo(call);
    }

    @PluginMethod
    public void startFlexibleUpdate(PluginCall call) {
        startUpdate(call, AppUpdateType.FLEXIBLE);
    }

    @PluginMethod
    public void startImmediateUpdate(PluginCall call) {
        startUpdate(call, AppUpdateType.IMMEDIATE);
    }

    @PluginMethod
    public void completeFlexibleUpdate(PluginCall call) {
        if (appUpdateManager == null) {
            call.unavailable("Play In-App Update belum siap di perangkat ini.");
            return;
        }

        appUpdateManager
            .completeUpdate()
            .addOnSuccessListener(unused -> {
                JSObject result = new JSObject();
                result.put("completed", true);
                call.resolve(result);
            })
            .addOnFailureListener(error -> call.reject(buildErrorMessage("menyelesaikan instalasi", error)));
    }

    private void resolveLatestInfo(@Nullable PluginCall call) {
        if (appUpdateManager == null) {
            if (call != null) {
                call.unavailable("Play In-App Update belum siap di perangkat ini.");
            }
            return;
        }

        appUpdateManager
            .getAppUpdateInfo()
            .addOnSuccessListener(appUpdateInfo -> {
                JSObject payload = createAppUpdateInfoPayload(appUpdateInfo);
                if (call != null) {
                    call.resolve(payload);
                } else {
                    notifyListeners(UPDATE_EVENT, payload, true);
                }
            })
            .addOnFailureListener(error -> {
                if (call != null) {
                    call.reject(buildErrorMessage("mengambil info update", error));
                } else {
                    JSObject payload = new JSObject();
                    payload.put("event", "error");
                    payload.put("message", buildErrorMessage("mengambil info update", error));
                    notifyListeners(UPDATE_EVENT, payload, true);
                }
            });
    }

    private void startUpdate(PluginCall call, int updateType) {
        if (appUpdateManager == null) {
            call.unavailable("Play In-App Update belum siap di perangkat ini.");
            return;
        }

        appUpdateManager
            .getAppUpdateInfo()
            .addOnSuccessListener(appUpdateInfo -> {
                AppUpdateOptions options = AppUpdateOptions.newBuilder(updateType).build();
                JSObject payload = createAppUpdateInfoPayload(appUpdateInfo);
                payload.put("requestedUpdateType", mapUpdateType(updateType));

                if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                    payload.put("started", false);
                    payload.put("downloaded", true);
                    call.resolve(payload);
                    return;
                }

                if (!appUpdateInfo.isUpdateTypeAllowed(options)) {
                    payload.put("started", false);
                    call.resolve(payload);
                    return;
                }

                try {
                    boolean started = appUpdateManager.startUpdateFlowForResult(
                        appUpdateInfo,
                        getActivity(),
                        options,
                        UPDATE_REQUEST_CODE
                    );
                    payload.put("started", started);
                    call.resolve(payload);
                } catch (IntentSender.SendIntentException error) {
                    call.reject(buildErrorMessage("memulai alur update", error));
                }
            })
            .addOnFailureListener(error -> call.reject(buildErrorMessage("memeriksa update terbaru", error)));
    }

    private void notifyLatestInfo(boolean resumeImmediate, boolean ignoreErrors) {
        if (appUpdateManager == null) {
            return;
        }

        appUpdateManager
            .getAppUpdateInfo()
            .addOnSuccessListener(appUpdateInfo -> {
                if (resumeImmediate && appUpdateInfo.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                    tryResumeImmediateUpdate(appUpdateInfo);
                    return;
                }

                notifyListeners(UPDATE_EVENT, createAppUpdateInfoPayload(appUpdateInfo), true);
            })
            .addOnFailureListener(error -> {
                if (!ignoreErrors) {
                    JSObject payload = new JSObject();
                    payload.put("event", "error");
                    payload.put("message", buildErrorMessage("mengambil info update", error));
                    notifyListeners(UPDATE_EVENT, payload, true);
                }
            });
    }

    private void tryResumeImmediateUpdate(AppUpdateInfo appUpdateInfo) {
        try {
            appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                getActivity(),
                AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
                UPDATE_REQUEST_CODE
            );
        } catch (IntentSender.SendIntentException error) {
            JSObject payload = new JSObject();
            payload.put("event", "error");
            payload.put("message", buildErrorMessage("melanjutkan update yang tertunda", error));
            notifyListeners(UPDATE_EVENT, payload, true);
        }
    }

    private JSObject createAppUpdateInfoPayload(AppUpdateInfo appUpdateInfo) {
        JSObject payload = createBasePayload();
        AppUpdateOptions flexibleOptions = AppUpdateOptions.defaultOptions(AppUpdateType.FLEXIBLE);
        AppUpdateOptions immediateOptions = AppUpdateOptions.defaultOptions(AppUpdateType.IMMEDIATE);
        Integer stalenessDays = appUpdateInfo.clientVersionStalenessDays();

        payload.put("event", "info");
        payload.put("nativeSupported", true);
        payload.put("updateAvailability", appUpdateInfo.updateAvailability());
        payload.put("updateAvailabilityLabel", mapUpdateAvailability(appUpdateInfo.updateAvailability()));
        payload.put("installStatus", appUpdateInfo.installStatus());
        payload.put("installStatusLabel", mapInstallStatus(appUpdateInfo.installStatus()));
        payload.put(
            "updateAvailable",
            appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE ||
            appUpdateInfo.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS
        );
        payload.put("flexibleAllowed", appUpdateInfo.isUpdateTypeAllowed(flexibleOptions));
        payload.put("immediateAllowed", appUpdateInfo.isUpdateTypeAllowed(immediateOptions));
        payload.put("downloaded", appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED);
        payload.put("availableVersionCode", appUpdateInfo.availableVersionCode());
        payload.put("updatePriority", appUpdateInfo.updatePriority());
        if (stalenessDays != null) {
            payload.put("clientVersionStalenessDays", stalenessDays);
        }
        return payload;
    }

    private JSObject createInstallStatePayload(InstallState state) {
        JSObject payload = createBasePayload();
        payload.put("event", "installState");
        payload.put("installStatus", state.installStatus());
        payload.put("installStatusLabel", mapInstallStatus(state.installStatus()));
        payload.put("bytesDownloaded", state.bytesDownloaded());
        payload.put("totalBytesToDownload", state.totalBytesToDownload());
        payload.put("installErrorCode", state.installErrorCode());
        payload.put("downloaded", state.installStatus() == InstallStatus.DOWNLOADED);
        return payload;
    }

    private JSObject createBasePayload() {
        JSObject payload = new JSObject();
        payload.put("platform", "android");
        payload.put("packageName", getContext().getPackageName());

        PackageInfo packageInfo = getPackageInfo();
        if (packageInfo != null) {
            payload.put("currentVersionName", packageInfo.versionName);
            payload.put("currentVersionCode", getLongVersionCode(packageInfo));
        }

        return payload;
    }

    @Nullable
    private PackageInfo getPackageInfo() {
        try {
            PackageManager packageManager = getContext().getPackageManager();
            String packageName = getContext().getPackageName();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                return packageManager.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(0));
            }
            return packageManager.getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException ignored) {
            return null;
        }
    }

    private long getLongVersionCode(PackageInfo packageInfo) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            return packageInfo.getLongVersionCode();
        }
        return packageInfo.versionCode;
    }

    private String mapInstallStatus(int status) {
        switch (status) {
            case InstallStatus.PENDING:
                return "pending";
            case InstallStatus.DOWNLOADING:
                return "downloading";
            case InstallStatus.DOWNLOADED:
                return "downloaded";
            case InstallStatus.INSTALLING:
                return "installing";
            case InstallStatus.INSTALLED:
                return "installed";
            case InstallStatus.FAILED:
                return "failed";
            case InstallStatus.CANCELED:
                return "canceled";
            case InstallStatus.REQUIRES_UI_INTENT:
                return "requires_ui_intent";
            case InstallStatus.UNKNOWN:
            default:
                return "unknown";
        }
    }

    private String mapUpdateAvailability(int availability) {
        switch (availability) {
            case UpdateAvailability.UPDATE_AVAILABLE:
                return "update_available";
            case UpdateAvailability.UPDATE_NOT_AVAILABLE:
                return "update_not_available";
            case UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS:
                return "developer_triggered_update_in_progress";
            case UpdateAvailability.UNKNOWN:
            default:
                return "unknown";
        }
    }

    private String mapUpdateType(int updateType) {
        return updateType == AppUpdateType.IMMEDIATE ? "immediate" : "flexible";
    }

    private String mapFlowResult(int resultCode) {
        if (resultCode == Activity.RESULT_OK) {
            return "accepted";
        }
        if (resultCode == Activity.RESULT_CANCELED) {
            return "canceled";
        }
        if (resultCode == com.google.android.play.core.install.model.ActivityResult.RESULT_IN_APP_UPDATE_FAILED) {
            return "failed";
        }
        return "unknown";
    }

    private String buildErrorMessage(String action, Exception error) {
        String suffix = error == null ? "" : ": " + error.getLocalizedMessage();
        return "Byronz gagal " + action + suffix;
    }
}
