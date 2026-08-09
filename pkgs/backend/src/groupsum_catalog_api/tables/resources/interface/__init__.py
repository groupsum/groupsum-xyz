from .api_explorer import InterfaceApiExplorer
from .command_line import InterfaceCommandLine
from .console import InterfaceConsole
from .dashboard import InterfaceDashboard
from .desktop_application import InterfaceDesktopApplication
from .developer_portal import InterfaceDeveloperPortal
from .extension import InterfaceExtension
from .gui import InterfaceGui
from .mobile_application import InterfaceMobileApplication
from .playground import InterfacePlayground
from .web_application import InterfaceWebApplication
from .website import InterfaceWebsite

RESOURCE_TABLES = {
    "interface.api_explorer": InterfaceApiExplorer,
    "interface.command_line": InterfaceCommandLine,
    "interface.console": InterfaceConsole,
    "interface.dashboard": InterfaceDashboard,
    "interface.desktop_application": InterfaceDesktopApplication,
    "interface.developer_portal": InterfaceDeveloperPortal,
    "interface.extension": InterfaceExtension,
    "interface.gui": InterfaceGui,
    "interface.mobile_application": InterfaceMobileApplication,
    "interface.playground": InterfacePlayground,
    "interface.web_application": InterfaceWebApplication,
    "interface.website": InterfaceWebsite,
}

__all__ = ["RESOURCE_TABLES"]
