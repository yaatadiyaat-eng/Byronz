class Memory:
    def __init__(self, limit=10):
        self.history = []
        self.limit = limit

    def add(self, role, content):
        self.history.append({
            "role": role,
            "content": content
        })

        # batasi memory
        if len(self.history) > self.limit:
            self.history.pop(0)