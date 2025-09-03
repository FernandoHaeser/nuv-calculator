# api.py

from flask import Flask, request, jsonify
from report_tool.ssh_connector import SSHConnector
from report_tool.data_service import DataService
from report_tool.log_analyzer import LogAnalyzer
from datetime import datetime

# Cria a aplicação Flask
app = Flask(__name__)


# --- Rota Principal (Home) ---
# Adicionada para fornecer uma resposta amigável na URL raiz
@app.route('/', methods=['GET'])
def home():
    """Fornece uma página de boas-vindas para a API."""
    return """
    <h1>API de Relatórios no Ar</h1>
    <p>API está funcionando corretamente.</p>
    <p>Para usar, acesse a rota <strong>/api/report</strong> com os parâmetros 'ip' e 'periodo'.</p>
    <p>Exemplo: <a href="/api/report?ip=SEU_IP_AQUI&periodo=hoje">/api/report?ip=SEU_IP_AQUI&periodo=hoje</a></p>
    """


# --- Lógica de Negócio Adaptada para a API ---
# Esta função centraliza a lógica que antes estava no ReportApp.run()
def get_report_data(ip, periodo):
    """
    Função principal que busca e processa os dados do relatório.
    Retorna um DataFrame do Pandas ou None em caso de erro.
    """
    # Credenciais fixas, como no script original.
    # Em um projeto real, isso viria de um lugar seguro!
    username = 'zabbix.script'
    password = 'SENHATEIMOSA1'
    port = 9922

    # 1. Conectar e preparar serviços
    ssh_connector = SSHConnector(ip, port, username, password)
    data_service = DataService(ssh_connector)
    log_analyzer = LogAnalyzer()

    # 2. Determinar quais logs buscar com base no período
    start_time, end_time = "00:00:00", "23:59:59"
    content = None

    if periodo == 'hoje':
        log_file_path = '/var/log/syslog'
        ssh_connector.execute_as_root('sudo mkdir -p /tmp/log/')
        content = data_service.fetch_filtered_log_content(log_file_path, start_time, end_time, "hoje")

    elif periodo == 'ontem':
        log_file_path = '/var/log/syslog.1'
        ssh_connector.execute_as_root('sudo mkdir -p /tmp/log/')
        content = data_service.fetch_filtered_log_content(log_file_path, start_time, end_time, "ontem")

    # Adicione outras lógicas de período (semana, personalizado) aqui se necessário...

    # 3. Analisar e retornar os dados
    if content:
        channel_mapping = data_service.get_channel_mapping()
        counter, uid_timestamps = log_analyzer.analyze_content_statistics(content)
        report_df = log_analyzer.format_data_to_dataframe(counter, uid_timestamps, channel_mapping)
        return report_df

    return None


# --- Definição da Rota da API ---
@app.route('/api/report', methods=['GET'])
def generate_report():
    """
    Esta é a função que será executada quando o frontend chamar a URL.
    Exemplo de chamada: http://127.0.0.1:5000/api/report?ip=1.2.3.4&periodo=hoje
    """
    # 1. Obter parâmetros da URL
    ip_address = request.args.get('ip')
    period = request.args.get('periodo', 'hoje')  # 'hoje' é o valor padrão

    if not ip_address:
        return jsonify({"error": "O parâmetro 'ip' é obrigatório."}), 400

    # 2. Chamar nossa lógica de negócio
    try:
        report_df = get_report_data(ip_address, period)

        if report_df is not None and not report_df.empty:
            # 3. Converter o DataFrame para um formato JSON
            # 'records' cria uma lista de dicionários, ideal para frontends
            report_json = report_df.to_dict(orient='records')
            return jsonify(report_json)
        else:
            return jsonify({"message": "Nenhum dado encontrado para o período informado."})

    except Exception as e:
        # Em caso de qualquer erro (ex: falha de conexão SSH), retorna um erro claro
        return jsonify({"error": f"Ocorreu um erro ao gerar o relatório: {str(e)}"}), 500


# --- Ponto de Entrada para Rodar a API ---
if __name__ == '__main__':
    # Roda o servidor web. 'debug=True' ajuda no desenvolvimento.
    app.run(host='0.0.0.0', port=5000, debug=True)