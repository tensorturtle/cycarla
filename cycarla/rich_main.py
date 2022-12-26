import time
import random

from rich import print
from rich import box
from rich.align import Align
from rich.console import Console, Group
from rich.layout import Layout
from rich.panel import Panel
from rich.progress import BarColumn, Progress, SpinnerColumn, TextColumn
from rich.syntax import Syntax
from rich.table import Table
from rich.live import Live 

from const import *

def make_rich_layout() -> Layout:
    '''
    Create a layout for the TUI
    '''
    layout = Layout(name="root")
    layout.split(
        Layout(name="header", size=3),
        Layout(name="body", ratio=1),
        Layout(name="footer", size=3),
    )
    return layout

class Header:
    def __rich__(self) -> Panel:
        grid = Table.grid(expand=True)
        grid.add_column(justify="center", ratio=1)
        grid.add_row(
            "[b]CyCARLA[/b] - Cycling in CARLA",
        )
        return Panel(grid, style="white")

class Footer:
    def __rich__(self) -> Panel:
        grid = Table.grid(expand=True)
        grid.add_column(justify="left", ratio=1)
        grid.add_column(justify="right", ratio=1)
        grid.add_row(
            "v0.1.0",
            "[b]Jason Sohn[/b] 2022 <jasonsohn@pm.me>",
        )
        return Panel(grid, style="white")
    
def random_number() -> int:
    return random.randint(0, 100)

def main():
    '''
    Create a TUI using Rich that shows the connection status of Bluetooth devices
    '''
    layout = make_rich_layout()
    layout["header"].update(Header())
    layout["footer"].update(Footer())
    

    with Live(layout, refresh_per_second=1) as live:
        while True:
            # Update the layout
            #layout["body"].update(Panel(str(random_number())))
            #live.update(layout)
            time.sleep(1/1)

if __name__ == "__main__":
    main()