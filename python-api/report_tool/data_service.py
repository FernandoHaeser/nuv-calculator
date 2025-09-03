# report_tool/data_service.py

import requests
from tqdm import tqdm
from .ssh_connector import SSHConnector


class DataService:
    """Responsável por buscar e preparar os dados, seja de logs remotos ou da API."""

    def __init__(self, ssh_connector: SSHConnector):
        self.ssh = ssh_connector

    def get_channel_mapping(self):
        """Busca o mapeamento de UID para nome do canal da API."""
        api_url = f"http://{self.ssh.ip}:5000/channels"
        try:
            response = requests.get(api_url, timeout=10)
            response.raise_for_status()
            return {channel['uid']: channel['name'] for channel in response.json()}
        except requests.RequestException as e:
            print(f"Erro ao acessar a API de canais: {e}")
            return {}

    def fetch_filtered_log_content(self, log_files_path, start_time, end_time, date_str_id):
        """Filtra e busca o conteúdo do log do servidor."""
        temp_file = f'/tmp/log/problemas_canais_{date_str_id}_{start_time}_{end_time}.txt'

        command = (
            f"cat {log_files_path} | awk -v start_time=\"{start_time}\" "
            f"-v end_time=\"{end_time}\" '{{time = substr($0, 8, 8); "
            f"if (time >= start_time && time <= end_time && /group switching start/) "
            f"{{ sub(/start/, \"\"); print $2, $3, $7 }}}}' "
            f'> {temp_file}'
        )

        with tqdm(desc="Gerando relatório remoto...", unit=" commands", total=1, leave=True) as pbar:
            self.ssh.execute_as_root(command)
            pbar.update(1)

        print()
        return self.ssh.get_remote_file_content(temp_file)