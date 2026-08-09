from .article import ContentArticle
from .case_study import ContentCaseStudy
from .insight import ContentInsight
from .podcast import ContentPodcast
from .presentation import ContentPresentation
from .report import ContentReport
from .video import ContentVideo
from .whitepaper import ContentWhitepaper

RESOURCE_TABLES = {
    "content.article": ContentArticle,
    "content.case_study": ContentCaseStudy,
    "content.insight": ContentInsight,
    "content.podcast": ContentPodcast,
    "content.presentation": ContentPresentation,
    "content.report": ContentReport,
    "content.video": ContentVideo,
    "content.whitepaper": ContentWhitepaper,
}

__all__ = ["RESOURCE_TABLES"]
