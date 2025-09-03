# report_tool/log_analyzer.py

import pandas as pd
from collections import defaultdict
from datetime import datetime, timedelta
from tqdm import tqdm


class LogAnalyzer:
    """Contém a lógica de negócio para processar o texto dos logs e extrair estatísticas."""

    def _calculate_avg_time_between(self, timestamps):
        """Calcula o tempo médio entre oscilações."""
        valid_timestamps = sorted([ts for ts in timestamps if isinstance(ts, datetime)])
        if len(valid_timestamps) <= 1:
            return "Oscilou apenas uma vez"

        total_delta = sum((valid_timestamps[i] - valid_timestamps[i - 1] for i in range(1, len(valid_timestamps))),
                          timedelta())
        avg_seconds = (total_delta / (len(valid_timestamps) - 1)).total_seconds()

        if avg_seconds < 60: return f"{avg_seconds:.2f} (segundos)"
        if avg_seconds < 3600: return f"{(avg_seconds / 60):.2f} (minutos)"
        return f"{(avg_seconds / 3600):.2f} (horas)"

    def analyze_content_statistics(self, content):
        """Extrai contadores e timestamps do conteúdo do log."""
        today = datetime.now()
        current_month, current_year = today.month, today.year
        counter = defaultdict(int)
        uid_timestamps = defaultdict(list)

        lines = content.strip().splitlines()
        for line in tqdm(lines, desc="Analisando conteúdo", leave=False):
            parts = line.split()
            if len(parts) >= 3:
                day, timestamp_str, uid = parts[0], parts[1], parts[2]
                try:
                    ts = datetime(
                        year=current_year, month=current_month, day=int(day),
                        hour=int(timestamp_str[:2]), minute=int(timestamp_str[3:5]), second=int(timestamp_str[6:8])
                    )
                    counter[uid] += 1
                    uid_timestamps[uid].append(ts)
                except (ValueError, IndexError):
                    pass
        return counter, uid_timestamps

    def format_data_to_dataframe(self, counter, uid_timestamps, channel_mapping):
        """Formata os dados analisados em um DataFrame do Pandas."""
        if not counter:
            return pd.DataFrame()

        df = pd.DataFrame(uid_timestamps.items(), columns=['UID do Canal', 'Timestamps'])
        df['QTT'] = df['UID do Canal'].map(counter)
        df['Nome do Canal'] = df['UID do Canal'].map(lambda uid: channel_mapping.get(uid, 'Desconhecido'))
        df['Tempo Médio de Oscilação'] = df['UID do Canal'].apply(
            lambda uid: self._calculate_avg_time_between(uid_timestamps.get(uid, []))
        )
        total_instabilities = df['QTT'].sum()
        if total_instabilities > 0:
            df['Total de Oscilações (%)'] = ((df['QTT'] / total_instabilities) * 100).round(2)
        else:
            df['Total de Oscilações (%)'] = 0

        return df.sort_values(by="Total de Oscilações (%)", ascending=False)