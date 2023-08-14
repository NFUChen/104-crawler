class LogQueue:
    def __init__(self) -> None:
        self.logs: list[str] = []
        self.max_size = 100
    def push(self, log: str) -> None:
        if self.logs == self.max_size:
            self.logs.pop(0)
        self.logs.append(log)

    def clear(self) -> None:
        self.logs = []
