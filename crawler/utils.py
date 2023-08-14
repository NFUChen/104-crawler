from typing import Iterator
import docker

def restart_docker_container(container_name: str) -> str:
    client = docker.from_env()
    container = client.containers.get(container_name)

    if container:
        container.restart()
        return "Container restarted successfully"
    else:
        return (f"Container '{container_name}' not found.")
    

if __name__ == "__main__":
    print(restart_docker_container("firefox"))