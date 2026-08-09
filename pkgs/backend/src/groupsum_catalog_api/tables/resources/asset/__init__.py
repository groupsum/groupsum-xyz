from .archive import AssetArchive
from .audio import AssetAudio
from .diagram import AssetDiagram
from .document import AssetDocument
from .font import AssetFont
from .icon import AssetIcon
from .image import AssetImage
from .logo import AssetLogo
from .screenshot import AssetScreenshot
from .video import AssetVideo

RESOURCE_TABLES = {
    "asset.archive": AssetArchive,
    "asset.audio": AssetAudio,
    "asset.diagram": AssetDiagram,
    "asset.document": AssetDocument,
    "asset.font": AssetFont,
    "asset.icon": AssetIcon,
    "asset.image": AssetImage,
    "asset.logo": AssetLogo,
    "asset.screenshot": AssetScreenshot,
    "asset.video": AssetVideo,
}

__all__ = ["RESOURCE_TABLES"]
