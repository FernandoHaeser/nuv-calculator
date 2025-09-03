# report_tool/ssh_connector.py

import paramiko
import time
from .utils import print_slow


class SSHConnector:
    """Responsável por toda a comunicação SSH com o servidor remoto."""

    def __init__(self, ip, port, username, password):
        self.ip = ip
        self.port = port
        self.username = username
        self.password = password
        self.client = None

    def _connect(self):
        """Método privado para estabelecer uma conexão."""
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.client.connect(
                self.ip, port=self.port, username=self.username,
                password=self.password, timeout=15, banner_timeout=15
            )
            return True
        except paramiko.AuthenticationException:
            print_slow("Falha na autenticação. Verifique suas credenciais.", delay=0.01)
            return False
        except Exception as e:
            print_slow(f"Erro na conexão SSH: {e}", delay=0.01)
            return False

    def disconnect(self):
        """Fecha a conexão se estiver aberta."""
        if self.client:
            self.client.close()

    def execute_command(self, command):
        """Executa um comando simples."""
        if not self._connect():
            return None, "Connection failed"
        try:
            stdin, stdout, stderr = self.client.exec_command(command)
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            return output, error
        finally:
            self.disconnect()

    def execute_as_root(self, command):
        """Executa um comando como root."""
        if not self._connect():
            return None, "Connection failed"
        try:
            channel = self.client.invoke_shell()
            time.sleep(1)
            channel.recv(4096)

            channel.send(f"sudo -S -p '' -i\n")
            time.sleep(0.5)
            channel.send(self.password + '\n')
            time.sleep(1)
            channel.recv(4096)

            channel.send(command + '\n')
            time.sleep(2.5)

            output = ""
            while channel.recv_ready():
                output += channel.recv(8192).decode('utf-8', errors='ignore')

            return output, None
        except Exception as e:
            return None, f"Erro ao executar comando como root: {e}"
        finally:
            self.disconnect()

    def get_remote_file_content(self, file_path):
        """Busca o conteúdo de um arquivo remoto."""
        command = f"cat {file_path}"
        output, error = self.execute_as_root(command)
        if error:
            print(f"Erro ao obter o conteúdo do arquivo: {error}")
            return None
        lines = output.splitlines()
        if len(lines) > 1:
            return "\n".join(lines[1:-1])
        return output

    def is_origin_server(self):
        """Valida se o servidor é um Origin."""
        output, error = self.execute_command('ls /etc/systemd/system/mse-aaa.service')
        return not error and output.strip()