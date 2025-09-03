# report_tool/report_generator.py

from rich.console import Console
from rich.table import Table
from rich import box
from rich.text import Text


class ReportGenerator:
    """Responsável por toda a saída visual para o console usando a biblioteca Rich."""

    def __init__(self):
        self.console = Console()

    def display_report(self, title, report_df):
        """Exibe um DataFrame como uma tabela formatada no console."""
        if report_df.empty:
            self.console.print(f"\n[yellow]Nenhum dado de oscilação encontrado para o período: {title}[/yellow]")
            return

        table = Table(title=f"\nRelatório de Oscilação - {title}", show_header=True,
                      header_style="bold white on dark_orange", box=box.SIMPLE)
        table.add_column("Nome do Canal", style="white", justify="center", no_wrap=True)
        table.add_column("UID do Canal", style="white", justify="center", no_wrap=True)
        table.add_column("QTT", style="white", justify="center", no_wrap=True)
        table.add_column("Tempo Médio", style="white", justify="center", no_wrap=True)
        table.add_column("Oscilações (%)", style="white", justify="center", no_wrap=True)

        for _, row in report_df.iterrows():
            table.add_row(
                str(row['Nome do Canal']),
                str(row['UID do Canal']),
                str(row['QTT']),
                str(row['Tempo Médio de Oscilação']),
                f"{row['Total de Oscilações (%)']}%"
            )
        self.console.print(table)

    def display_legend(self):
        """Exibe a legenda das colunas do relatório."""
        legend = Text("\nLegenda:\n", style="bold underline")
        legend.append("Nome do Canal: Nome do canal identificado pelo UID.\n")
        legend.append("UID do Canal: Identificador único do canal.\n")
        legend.append("QTT: Quantidade de ocorrências de oscilação.\n")
        legend.append("Tempo Médio: Tempo médio entre as oscilações.\n")
        legend.append("Oscilações (%): Percentual do total de oscilações de todos os canais.\n")
        self.console.print(legend)