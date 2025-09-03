# report_tool/utils.py

import sys
import time
import os
import platform

def clear_screen():
    """Limpa a tela do console."""
    system_name = platform.system()
    os.system('cls' if system_name == "Windows" else 'clear')

def print_slow(text, delay=0.01, end='\n'):
    """Imprime texto lentamente para um efeito de digitação."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    sys.stdout.write(end)
    sys.stdout.flush()