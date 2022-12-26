from textual.app import App, ComposeResult
from textual.containers import Container
from textual.widgets import Header, Footer, Button, Static
from textual.reactive import reactive

# mock stuff mainly
import time
from time import monotonic
import random

# Interface to bleak

live_clients = {}

class BTConnectionStatus(Static):
    '''
    A widget that shows the status of a bluetooth connection
    '''
    def __init__(self, bt_address):
        super().__init__()
        self.bt_address = bt_address

    connection_status = reactive("DISCONNECTED")

    def on_mount(self) -> None:
        self.set_interval(1/30, self.update_connection_status)
        pass
    
    def update_connection_status(self) -> None:
        if self.connection_status == "CONNECTING":
            self.connection_status =  mock_check_connection()
        self.update(self.connection_status)
    
    def watch_connection_status(self, time: float) -> None:
        '''
        The 'watch' keyword means that this function will be called
        when the 'time' property changes
        '''
        if self.connection_status == "CONNECTING":
            self.remove_class("connected")
            self.add_class("enabled")
        elif self.connection_status == "CONNECTED":
            self.remove_class("enabled")
            self.add_class("connected")
        elif self.connection_status == "DISCONNECTED":
            self.remove_class("connected")
            self.remove_class("enabled")
    
    def attempt_connect(self) -> None:
        self.connection_status = "CONNECTING"
    
    def disconnect(self) -> None:
        self.connection_status = "DISCONNECTED"
    
def mock_connection_status() -> str:
    return random.choice([
        "DISCONNECTED",
        "CONNECTING",
        "CONNECTED",
    ])

def mock_check_connection() -> str:
    return "CONNECTED"

def check_bt_connection() -> str:
    pass


class BTService(Static):
    '''
    A bluetooth connection widget for one type of device 
    '''
    def on_button_pressed(self, event: Button.Pressed) -> None:
        '''
        Handle button presses
        '''
        button_id = event.button.id
        status_display = self.query_one(BTConnectionStatus)
        if event.button.id == "bt_enable":
            self.add_class("enabled")
            status_display.attempt_connect()
        elif event.button.id == "bt_disable":
            self.remove_class("enabled")
            self.remove_class("connected")
            status_display.disconnect()
    def compose(self) -> ComposeResult:
        '''
        Create child widgets for this widget
        '''
        yield Button("Enable", id="bt_enable", variant="success")
        yield Button("Disable", id="bt_disable", variant="error")
        yield Button("Choose Next", id="bt_next")
        yield BTConnectionStatus("DISCONNECTED")
    
    def action_bt_connect(self) -> None:
        '''
        An action to connect to a bluetooth device
        '''
        print("Connecting to bluetooth device...")
    
    def action_bt_disconnect(self) -> None:
        '''
        An action to disconnect from a bluetooth device
        '''
        print("Disconnecting from bluetooth device...")
    
    def action_bt_next(self) -> None:
        '''
        An action to move to the next bluetooth device
        '''
        print("Moving to next bluetooth device...")
    


STERZO_ADDRESS = "EA:1B:D7:96:1A:A1" 
RVR_ADDRESS = "D4:73:B6:4C:0E:72"

live_clients.update({STERZO_ADDRESS: None})
live_clients.update({RVR_ADDRESS: None})

class CycarlaApp(App):
    '''
    TUI for CyCARLA

    Connects to hardware via Bluetooth & other protocols,
    and sends processed outputs to CARLA client app via Websockets.
    Also provides a Terminal-based User Interface to see connection status.
    '''
    CSS_PATH = "cycarla_style.css"
    BINDINGS = [("q", "quit", "Quit Application"),
                ]

    def compose(self) -> ComposeResult:
        '''
        Create child widgets for the app
        '''
        yield Header()
        yield Footer()
        yield Container(
            BTService(STERZO_ADDRESS), 
            BTService(RVR_ADDRESS)
            )

    def action_toggle_dark(self) -> None:
        '''
        An action to toggle dark mode
        '''
        self.dark = not self.dark
    
    def action_print_hello(self) -> None:
        print("Hello World!")

if __name__ == "__main__":
    app = CycarlaApp()
    app.run()