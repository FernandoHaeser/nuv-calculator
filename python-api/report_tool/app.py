# report_tool/app.py

import sys
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich import box  # <--- CORREÇÃO ADICIONADA AQUI

# Importa as classes e funções dos outros módulos do pacote
from .ssh_connector import SSHConnector
from .data_service import DataService
from .log_analyzer import LogAnalyzer
from .report_generator import ReportGenerator
from .utils import clear_screen, print_slow


class ReportApp:
    """Orquestra todas as outras classes e gerencia o fluxo principal e a interação com o usuário."""

    def __init__(self):
        self.ssh_connector = None
        self.data_service = None
        self.log_analyzer = LogAnalyzer()
        self.report_generator = ReportGenerator()

    def _get_credentials_and_connect(self):
        """Solicita credenciais, conecta e valida o servidor."""
        print_slow('Abaixo serão solicitadas algumas informações para acesso ao servidor do cliente:\n', delay=0.01)
        while True:
            ip = input('# Informe qual é o IP do servidor Origin: ').strip()
            print()
            username = 'zabbix.script'
            password = 'SENHATEIMOSA1'
            port = 9922

            connector = SSHConnector(ip, port, username, password)
            if connector.execute_command('echo Connection test')[1] == '':
                if connector.is_origin_server():
                    print_slow('o IP digitado é de um servidor Origin, prosseguindo...\n', delay=0.01)
                    self.ssh_connector = connector
                    self.data_service = DataService(self.ssh_connector)
                    return True
                else:
                    print_slow('O servidor informado não é um Origin, informe o servidor correto!\n', delay=0.01)

            retry = input("Deseja tentar novamente? (s/n): ").strip().lower()
            if retry != 's':
                return False

    def _select_report_period(self):
        """Exibe o menu e obtém a escolha do período."""
        console = Console()
        opcoes = ["Hoje", "Ontem", "Esta Semana (últimos 8 dias)", "Personalizado", "Sair"]
        table = Table(title="Selecione o período do relatório:", box=box.SIMPLE_HEAVY)
        table.add_column("Opção", justify="center")
        table.add_column("Descrição")
        for i, desc in enumerate(opcoes, 1):
            table.add_row(str(i), desc)

        console.print(table)

        while True:
            choice = input("Digite o número da opção desejada: ").strip()
            if choice in [str(i) for i in range(1, len(opcoes) + 1)]:
                return choice
            print_slow("Opção inválida. Tente novamente.", delay=0.01)

    def _formatar_data_objeto(self, data_str):
        """Tenta converter uma string para um objeto data."""
        for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
            try:
                return datetime.strptime(data_str, fmt).date()
            except ValueError:
                pass
        return None

    def _input_data_valida(self):
        """Solicita uma data ao usuário até que seja válida."""
        while True:
            data_usuario = input('# Informe a data que você deseja buscar DD/MM/AAAA: ').strip()
            if not data_usuario:
                print("A data não pode ser vazia.")
                continue
            data_obj = self._formatar_data_objeto(data_usuario)
            if data_obj:
                return data_obj
            else:
                print("Formato de data inválido. Por favor, use o formato DD/MM/AAAA.")

    def _obter_horario_valido(self, mensagem):
        """Solicita um horário ao usuário até que seja válido."""
        while True:
            horario_str = input(mensagem).strip()
            try:
                datetime.strptime(horario_str, '%H:%M:%S')
                return horario_str
            except ValueError:
                print("Horário inválido. Por favor, digite novamente no formato HH:MM:SS.")

    def run(self):
        """Executa o fluxo principal da aplicação."""
        clear_screen()
        print_slow('''
    =========================================================================
    ||                                                                      ||
    ||  Programa para gerar relatórios estatísticos de oscilação de canais. ||
    ||                                                by. Gabriel Borges    ||
    =========================================================================
    ''', delay=0.001)

        if not self._get_credentials_and_connect():
            print_slow("Encerrando o programa, até mais!", delay=0.01)
            sys.exit()

        while True:
            content = None
            start_time, end_time = "00:00:00", "23:59:59"
            report_title = ""

            option = self._select_report_period()

            if option == '1':
                log_file_path = '/var/log/syslog'
                self.ssh_connector.execute_as_root('sudo mkdir -p /tmp/log/')
                content = self.data_service.fetch_filtered_log_content(log_file_path, start_time, end_time, "hoje")
                report_title = "Hoje"

            elif option == '2':
                log_file_path = '/var/log/syslog.1'
                self.ssh_connector.execute_as_root('sudo mkdir -p /tmp/log/')
                content = self.data_service.fetch_filtered_log_content(log_file_path, start_time, end_time, "ontem")
                report_title = "Ontem"

            elif option == '3':
                prep_command = 'sudo mkdir -p /tmp/log/ && ' + ' && '.join(
                    [f'sudo gzip -dc /var/log/syslog.{i}.gz > /tmp/log/syslog.{i}' for i in range(2, 8)])
                self.ssh_connector.execute_as_root(prep_command)
                log_files = ['/var/log/syslog', '/var/log/syslog.1'] + [f'/tmp/log/syslog.{i}' for i in range(2, 8)]
                log_file_path = ' '.join(log_files)
                content = self.data_service.fetch_filtered_log_content(log_file_path, start_time, end_time, "semanal")
                report_title = "Esta Semana"

            elif option == '4':
                data_usuario = self._input_data_valida()
                start_time = self._obter_horario_valido('# Informe o horário de inicio (HH:MM:SS): ')
                end_time = self._obter_horario_valido('# Informe o horário final (HH:MM:SS): ')
                days_ago = (datetime.now().date() - data_usuario).days

                if 0 <= days_ago <= 7:
                    prep_command = 'sudo mkdir -p /tmp/log/'
                    if days_ago == 0:
                        log_file_path = '/var/log/syslog'
                    elif days_ago == 1:
                        log_file_path = '/var/log/syslog.1'
                    else:
                        log_file_path = f'/tmp/log/syslog.{days_ago}'
                        prep_command += f' && sudo gzip -dc /var/log/syslog.{days_ago}.gz > {log_file_path}'

                    self.ssh_connector.execute_as_root(prep_command)
                    content = self.data_service.fetch_filtered_log_content(log_file_path, start_time, end_time,
                                                                           data_usuario.strftime('%d-%m-%Y'))
                    report_title = data_usuario.strftime('%d/%m/%Y')
                else:
                    print_slow('A CDNTV só armazena logs de até 8 dias!', delay=0.01)
                    continue

            elif option == '5':
                break

            if content:
                channel_mapping = self.data_service.get_channel_mapping()
                counter, uid_timestamps = self.log_analyzer.analyze_content_statistics(content)
                report_df = self.log_analyzer.format_data_to_dataframe(counter, uid_timestamps, channel_mapping)
                self.report_generator.display_report(report_title, report_df)
                self.report_generator.display_legend()
            else:
                print('Não foi possível buscar ou não existem dados para o período informado.')

            if input("\nDeseja executar o script novamente? (s/n): ").strip().lower() != 's':
                break
            clear_screen()

        print_slow("Saindo do script...", delay=0.01)