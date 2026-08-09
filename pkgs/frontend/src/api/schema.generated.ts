export interface paths {
    "/activitybuildrun": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityBuildRun.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitybuildrun/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityBuildRun.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitydeploymentrun": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityDeploymentRun.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitydeploymentrun/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityDeploymentRun.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitypublicationrun": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityPublicationRun.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitypublicationrun/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityPublicationRun.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitytestrun": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityTestRun.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activitytestrun/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityTestRun.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activityworkflowrun": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityWorkflowRun.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/activityworkflowrun/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ActivityWorkflowRun.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/packages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_packages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/packages/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_package"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/releases/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_release"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/repositories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_repositories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/repositories/{owner}/{repository}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_repository"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_resources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/resources/{resource_type}/{route_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_resource"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/technologies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_technologies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/catalog/technologies/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["catalog_technology"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["entities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/entities/{entity_type}/{entity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["entity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/insights": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["insights"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/organizations/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["organization"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/portfolio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["portfolios"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/portfolio/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["portfolio"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["products"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/products/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["product"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/repository-metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["repository_metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/services": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["services"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/services/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["service"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/solutions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["solutions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/solutions/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["solution"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactattestation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactAttestation.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactattestation/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactAttestation.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactauditreport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactAuditReport.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactauditreport/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactAuditReport.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactbenchmarkreport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactBenchmarkReport.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactbenchmarkreport/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactBenchmarkReport.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactbuild": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactBuild.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactbuild/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactBuild.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactcoveragereport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactCoverageReport.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactcoveragereport/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactCoverageReport.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactgenerateddocument": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactGeneratedDocument.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactgenerateddocument/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactGeneratedDocument.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactprovenancestatement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactProvenanceStatement.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactprovenancestatement/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactProvenanceStatement.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactpublicationrecord": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactPublicationRecord.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactpublicationrecord/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactPublicationRecord.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactsecurityreport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactSecurityReport.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifactsecurityreport/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactSecurityReport.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifacttestreport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactTestReport.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/artifacttestreport/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ArtifactTestReport.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetarchive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetArchive.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetarchive/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetArchive.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetaudio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetAudio.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetaudio/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetAudio.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetdiagram": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetDiagram.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetdiagram/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetDiagram.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetdocument": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetDocument.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetdocument/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetDocument.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetfont": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetFont.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetfont/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetFont.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/asseticon": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetIcon.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/asseticon/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetIcon.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetimage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetImage.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetimage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetImage.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetlogo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetLogo.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetlogo/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetLogo.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetscreenshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetScreenshot.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetscreenshot/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetScreenshot.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetvideo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetVideo.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assetvideo/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AssetVideo.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/association": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/association/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Association.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationcollector": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationCollector.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationcollector/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationCollector.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationgenerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationGenerator.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationgenerator/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationGenerator.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationgithubaction": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationGithubAction.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationgithubaction/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationGithubAction.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationpipeline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationPipeline.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationpipeline/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationPipeline.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationscript": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationScript.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationscript/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationScript.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationworkflow": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationWorkflow.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automationworkflow/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AutomationWorkflow.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collectioncatalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CollectionCatalog.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collectioncatalog/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CollectionCatalog.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collectionecosystem": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CollectionEcosystem.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collectionecosystem/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CollectionEcosystem.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collectionsuite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CollectionSuite.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collectionsuite/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CollectionSuite.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentarticle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentArticle.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentarticle/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentArticle.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentcasestudy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentCaseStudy.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentcasestudy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentCaseStudy.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentinsight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentInsight.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentinsight/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentInsight.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentpodcast": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentPodcast.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentpodcast/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentPodcast.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentpresentation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentPresentation.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentpresentation/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentPresentation.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentreport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentReport.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentreport/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentReport.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentvideo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentVideo.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentvideo/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentVideo.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentwhitepaper": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentWhitepaper.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contentwhitepaper/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContentWhitepaper.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractasyncapi": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractAsyncapi.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractasyncapi/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractAsyncapi.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractconfigurationschema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractConfigurationSchema.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractconfigurationschema/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractConfigurationSchema.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractdataschema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractDataSchema.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractdataschema/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractDataSchema.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracteventschema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractEventSchema.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contracteventschema/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractEventSchema.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractgraphql": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractGraphql.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractgraphql/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractGraphql.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractjsonschema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractJsonSchema.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractjsonschema/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractJsonSchema.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractopenapi": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractOpenapi.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractopenapi/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractOpenapi.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractopenrpc": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractOpenrpc.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractopenrpc/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractOpenrpc.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractprotobuf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractProtobuf.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractprotobuf/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractProtobuf.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractprotocolspec": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractProtocolSpec.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/contractprotocolspec/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ContractProtocolSpec.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/databenchmarkcorpus": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataBenchmarkCorpus.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/databenchmarkcorpus/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataBenchmarkCorpus.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datadataset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataDataset.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datadataset/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataDataset.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datafixture": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataFixture.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datafixture/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataFixture.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datamapping": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataMapping.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datamapping/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataMapping.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datamodel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataModel.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datamodel/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataModel.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datavocabulary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataVocabulary.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/datavocabulary/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DataVocabulary.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributionarchive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionArchive.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributionarchive/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionArchive.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributionbinary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionBinary.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributionbinary/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionBinary.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributionbundle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionBundle.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributionbundle/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionBundle.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributioncontainerimage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionContainerImage.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/distributioncontainerimage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DistributionContainerImage.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationchangelog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationChangelog.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationchangelog/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationChangelog.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationcollection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationCollection.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationcollection/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationCollection.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationconcept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationConcept.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationconcept/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationConcept.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationcookbook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationCookbook.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationcookbook/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationCookbook.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationfaq": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationFaq.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationfaq/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationFaq.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationguide": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationGuide.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationguide/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationGuide.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationhowto": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationHowTo.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationhowto/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationHowTo.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationquickstart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationQuickstart.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationquickstart/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationQuickstart.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationreference": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationReference.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationreference/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationReference.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationrunbook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationRunbook.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationrunbook/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationRunbook.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationsite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationSite.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationsite/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationSite.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationtutorial": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationTutorial.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/documentationtutorial/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["DocumentationTutorial.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceadr": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceAdr.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceadr/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceAdr.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceboundary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceBoundary.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceboundary/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceBoundary.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceclaim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceClaim.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceclaim/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceClaim.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceevidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceEvidence.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceevidence/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceEvidence.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancefeature": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceFeature.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancefeature/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceFeature.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceissue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceIssue.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceissue/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceIssue.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceprofile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceProfile.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governanceprofile/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceProfile.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancerelease": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceRelease.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancerelease/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceRelease.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancerisk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceRisk.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancerisk/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceRisk.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancescope": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceScope.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancescope/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceScope.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancespec": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceSpec.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancespec/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceSpec.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancetest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceTest.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/governancetest/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GovernanceTest.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/healthz": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Catalog API health */
        get: operations["healthz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationadapter": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationAdapter.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationadapter/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationAdapter.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationdemo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationDemo.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationdemo/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationDemo.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationexample": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationExample.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationexample/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationExample.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationnotebook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationNotebook.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationnotebook/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationNotebook.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationplugin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationPlugin.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationplugin/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationPlugin.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationrecipe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationRecipe.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationrecipe/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationRecipe.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationreference": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationReference.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationreference/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationReference.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationsampleapplication": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationSampleApplication.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationsampleapplication/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationSampleApplication.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationshowcase": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationShowcase.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationshowcase/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationShowcase.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationtemplate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationTemplate.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/implementationtemplate/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ImplementationTemplate.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceapiexplorer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceApiExplorer.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceapiexplorer/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceApiExplorer.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacecommandline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceCommandLine.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacecommandline/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceCommandLine.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceconsole": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceConsole.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceconsole/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceConsole.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacedashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceDashboard.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacedashboard/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceDashboard.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacedesktopapplication": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceDesktopApplication.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacedesktopapplication/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceDesktopApplication.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacedeveloperportal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceDeveloperPortal.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacedeveloperportal/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceDeveloperPortal.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceextension": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceExtension.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceextension/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceExtension.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacegui": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceGui.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacegui/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceGui.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacemobileapplication": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceMobileApplication.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacemobileapplication/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceMobileApplication.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceplayground": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfacePlayground.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfaceplayground/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfacePlayground.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacewebapplication": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceWebApplication.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacewebapplication/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceWebApplication.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacewebsite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceWebsite.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interfacewebsite/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["InterfaceWebsite.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalattribution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalAttribution.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalattribution/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalAttribution.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalcontributoragreement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalContributorAgreement.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalcontributoragreement/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalContributorAgreement.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legallicense": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalLicense.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legallicense/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalLicense.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalnotice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalNotice.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalnotice/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalNotice.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalpolicy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalPolicy.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalpolicy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalPolicy.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalsecuritypolicy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalSecurityPolicy.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalsecuritypolicy/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalSecurityPolicy.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalterms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalTerms.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/legalterms/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LegalTerms.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offeringservice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OfferingService.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offeringservice/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OfferingService.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offeringsolution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OfferingSolution.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offeringsolution/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OfferingSolution.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organization": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Organization.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organization/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Organization.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/package": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Package.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/package/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Package.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/partyperson": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PartyPerson.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/partyperson/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PartyPerson.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/partyteam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PartyTeam.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/partyteam/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PartyTeam.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfolio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Portfolio.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portfolio/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Portfolio.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Product.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasebinary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseBinary.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasebinary/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseBinary.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasebundle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseBundle.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasebundle/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseBundle.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasecontainer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseContainer.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasecontainer/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseContainer.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasepackage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleasePackage.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releasepackage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleasePackage.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releaserepository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseRepository.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/releaserepository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReleaseRepository.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repository": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repository/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Repository.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotregistry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotRegistry.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/repositoryssotregistry/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RepositorySsotRegistry.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeapi": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeApi.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeapi/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeApi.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimedeployment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeDeployment.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimedeployment/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeDeployment.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimedeploymenttarget": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeDeploymentTarget.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimedeploymenttarget/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeDeploymentTarget.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeendpoint": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeEndpoint.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeendpoint/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeEndpoint.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeenvironment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeEnvironment.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeenvironment/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeEnvironment.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimegateway": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeGateway.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimegateway/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeGateway.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimescheduledjob": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeScheduledJob.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimescheduledjob/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeScheduledJob.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeservice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeService.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeservice/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeService.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimewebhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeWebhook.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimewebhook/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeWebhook.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeworker": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeWorker.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/runtimeworker/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RuntimeWorker.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourcebranch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceBranch.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourcebranch/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceBranch.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourcecommit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceCommit.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourcecommit/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceCommit.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourcetag": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceTag.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourcetag/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceTag.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourceworkspace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceWorkspace.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sourceworkspace/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SourceWorkspace.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomyaudience": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyAudience.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomyaudience/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyAudience.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomycapability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyCapability.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomycapability/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyCapability.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomycategory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyCategory.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomycategory/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyCategory.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomydomain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyDomain.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomydomain/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyDomain.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomyecosystem": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyEcosystem.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomyecosystem/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyEcosystem.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomylanguage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyLanguage.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomylanguage/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyLanguage.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomytopic": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyTopic.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/taxonomytopic/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TaxonomyTopic.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/technology": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Technology.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/technology/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Technology.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workdiscussion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkDiscussion.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workdiscussion/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkDiscussion.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workissue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkIssue.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workissue/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkIssue.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workmilestone": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkMilestone.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workmilestone/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkMilestone.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workproject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkProject.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workproject/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkProject.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workpullrequest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkPullRequest.list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/workpullrequest/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["WorkPullRequest.read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * ActivityBuildRunListResponse
         * @description Tigrbl v3 ActivityBuildRun list schema
         */
        ActivityBuildRunListResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityBuildRunReadResponse
         * @description Tigrbl v3 ActivityBuildRun read schema
         */
        ActivityBuildRunReadResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityDeploymentRunListResponse
         * @description Tigrbl v3 ActivityDeploymentRun list schema
         */
        ActivityDeploymentRunListResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityDeploymentRunReadResponse
         * @description Tigrbl v3 ActivityDeploymentRun read schema
         */
        ActivityDeploymentRunReadResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityPublicationRunListResponse
         * @description Tigrbl v3 ActivityPublicationRun list schema
         */
        ActivityPublicationRunListResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityPublicationRunReadResponse
         * @description Tigrbl v3 ActivityPublicationRun read schema
         */
        ActivityPublicationRunReadResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityTestRunListResponse
         * @description Tigrbl v3 ActivityTestRun list schema
         */
        ActivityTestRunListResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityTestRunReadResponse
         * @description Tigrbl v3 ActivityTestRun read schema
         */
        ActivityTestRunReadResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityWorkflowRunListResponse
         * @description Tigrbl v3 ActivityWorkflowRun list schema
         */
        ActivityWorkflowRunListResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ActivityWorkflowRunReadResponse
         * @description Tigrbl v3 ActivityWorkflowRun read schema
         */
        ActivityWorkflowRunReadResponse: {
            /**
             * Actor
             * @default null
             */
            actor: string | null;
            /**
             * Completed At
             * @default null
             */
            completed_at: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Result
             * @default null
             */
            result: {
                [key: string]: unknown;
            } | null;
            /**
             * Started At
             * @default null
             */
            started_at: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
        };
        /**
         * ArtifactAttestationListResponse
         * @description Tigrbl v3 ArtifactAttestation list schema
         */
        ArtifactAttestationListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactAttestationReadResponse
         * @description Tigrbl v3 ArtifactAttestation read schema
         */
        ArtifactAttestationReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactAuditReportListResponse
         * @description Tigrbl v3 ArtifactAuditReport list schema
         */
        ArtifactAuditReportListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactAuditReportReadResponse
         * @description Tigrbl v3 ArtifactAuditReport read schema
         */
        ArtifactAuditReportReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactBenchmarkReportListResponse
         * @description Tigrbl v3 ArtifactBenchmarkReport list schema
         */
        ArtifactBenchmarkReportListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactBenchmarkReportReadResponse
         * @description Tigrbl v3 ArtifactBenchmarkReport read schema
         */
        ArtifactBenchmarkReportReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactBuildListResponse
         * @description Tigrbl v3 ArtifactBuild list schema
         */
        ArtifactBuildListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactBuildReadResponse
         * @description Tigrbl v3 ArtifactBuild read schema
         */
        ArtifactBuildReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactCoverageReportListResponse
         * @description Tigrbl v3 ArtifactCoverageReport list schema
         */
        ArtifactCoverageReportListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactCoverageReportReadResponse
         * @description Tigrbl v3 ArtifactCoverageReport read schema
         */
        ArtifactCoverageReportReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactGeneratedDocumentListResponse
         * @description Tigrbl v3 ArtifactGeneratedDocument list schema
         */
        ArtifactGeneratedDocumentListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactGeneratedDocumentReadResponse
         * @description Tigrbl v3 ArtifactGeneratedDocument read schema
         */
        ArtifactGeneratedDocumentReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactProvenanceStatementListResponse
         * @description Tigrbl v3 ArtifactProvenanceStatement list schema
         */
        ArtifactProvenanceStatementListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactProvenanceStatementReadResponse
         * @description Tigrbl v3 ArtifactProvenanceStatement read schema
         */
        ArtifactProvenanceStatementReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactPublicationRecordListResponse
         * @description Tigrbl v3 ArtifactPublicationRecord list schema
         */
        ArtifactPublicationRecordListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactPublicationRecordReadResponse
         * @description Tigrbl v3 ArtifactPublicationRecord read schema
         */
        ArtifactPublicationRecordReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactSecurityReportListResponse
         * @description Tigrbl v3 ArtifactSecurityReport list schema
         */
        ArtifactSecurityReportListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactSecurityReportReadResponse
         * @description Tigrbl v3 ArtifactSecurityReport read schema
         */
        ArtifactSecurityReportReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactTestReportListResponse
         * @description Tigrbl v3 ArtifactTestReport list schema
         */
        ArtifactTestReportListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ArtifactTestReportReadResponse
         * @description Tigrbl v3 ArtifactTestReport read schema
         */
        ArtifactTestReportReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetArchiveListResponse
         * @description Tigrbl v3 AssetArchive list schema
         */
        AssetArchiveListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetArchiveReadResponse
         * @description Tigrbl v3 AssetArchive read schema
         */
        AssetArchiveReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetAudioListResponse
         * @description Tigrbl v3 AssetAudio list schema
         */
        AssetAudioListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetAudioReadResponse
         * @description Tigrbl v3 AssetAudio read schema
         */
        AssetAudioReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetDiagramListResponse
         * @description Tigrbl v3 AssetDiagram list schema
         */
        AssetDiagramListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetDiagramReadResponse
         * @description Tigrbl v3 AssetDiagram read schema
         */
        AssetDiagramReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetDocumentListResponse
         * @description Tigrbl v3 AssetDocument list schema
         */
        AssetDocumentListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetDocumentReadResponse
         * @description Tigrbl v3 AssetDocument read schema
         */
        AssetDocumentReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetFontListResponse
         * @description Tigrbl v3 AssetFont list schema
         */
        AssetFontListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetFontReadResponse
         * @description Tigrbl v3 AssetFont read schema
         */
        AssetFontReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetIconListResponse
         * @description Tigrbl v3 AssetIcon list schema
         */
        AssetIconListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetIconReadResponse
         * @description Tigrbl v3 AssetIcon read schema
         */
        AssetIconReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetImageListResponse
         * @description Tigrbl v3 AssetImage list schema
         */
        AssetImageListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetImageReadResponse
         * @description Tigrbl v3 AssetImage read schema
         */
        AssetImageReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetLogoListResponse
         * @description Tigrbl v3 AssetLogo list schema
         */
        AssetLogoListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetLogoReadResponse
         * @description Tigrbl v3 AssetLogo read schema
         */
        AssetLogoReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetScreenshotListResponse
         * @description Tigrbl v3 AssetScreenshot list schema
         */
        AssetScreenshotListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetScreenshotReadResponse
         * @description Tigrbl v3 AssetScreenshot read schema
         */
        AssetScreenshotReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetVideoListResponse
         * @description Tigrbl v3 AssetVideo list schema
         */
        AssetVideoListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssetVideoReadResponse
         * @description Tigrbl v3 AssetVideo read schema
         */
        AssetVideoReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AssociationListResponse
         * @description Tigrbl v3 Association list schema
         */
        AssociationListResponse: {
            /**
             * Attributes
             * @default null
             */
            attributes: {
                [key: string]: unknown;
            } | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Relationship Type */
            relationship_type: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
            /** Source Id */
            source_id: string;
            /** Source Type */
            source_type: string;
            /** Target Id */
            target_id: string;
            /** Target Type */
            target_type: string;
        };
        /**
         * AssociationReadResponse
         * @description Tigrbl v3 Association read schema
         */
        AssociationReadResponse: {
            /**
             * Attributes
             * @default null
             */
            attributes: {
                [key: string]: unknown;
            } | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Relationship Type */
            relationship_type: string;
            /**
             * Role
             * @default null
             */
            role: string;
            /**
             * Sort Order
             * @default null
             */
            sort_order: number;
            /** Source Id */
            source_id: string;
            /** Source Type */
            source_type: string;
            /** Target Id */
            target_id: string;
            /** Target Type */
            target_type: string;
        };
        /**
         * AutomationCollectorListResponse
         * @description Tigrbl v3 AutomationCollector list schema
         */
        AutomationCollectorListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationCollectorReadResponse
         * @description Tigrbl v3 AutomationCollector read schema
         */
        AutomationCollectorReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationGeneratorListResponse
         * @description Tigrbl v3 AutomationGenerator list schema
         */
        AutomationGeneratorListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationGeneratorReadResponse
         * @description Tigrbl v3 AutomationGenerator read schema
         */
        AutomationGeneratorReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationGithubActionListResponse
         * @description Tigrbl v3 AutomationGithubAction list schema
         */
        AutomationGithubActionListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationGithubActionReadResponse
         * @description Tigrbl v3 AutomationGithubAction read schema
         */
        AutomationGithubActionReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationPipelineListResponse
         * @description Tigrbl v3 AutomationPipeline list schema
         */
        AutomationPipelineListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationPipelineReadResponse
         * @description Tigrbl v3 AutomationPipeline read schema
         */
        AutomationPipelineReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationScriptListResponse
         * @description Tigrbl v3 AutomationScript list schema
         */
        AutomationScriptListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationScriptReadResponse
         * @description Tigrbl v3 AutomationScript read schema
         */
        AutomationScriptReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationWorkflowListResponse
         * @description Tigrbl v3 AutomationWorkflow list schema
         */
        AutomationWorkflowListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * AutomationWorkflowReadResponse
         * @description Tigrbl v3 AutomationWorkflow read schema
         */
        AutomationWorkflowReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * CollectionCatalogListResponse
         * @description Tigrbl v3 CollectionCatalog list schema
         */
        CollectionCatalogListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * CollectionCatalogReadResponse
         * @description Tigrbl v3 CollectionCatalog read schema
         */
        CollectionCatalogReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * CollectionEcosystemListResponse
         * @description Tigrbl v3 CollectionEcosystem list schema
         */
        CollectionEcosystemListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * CollectionEcosystemReadResponse
         * @description Tigrbl v3 CollectionEcosystem read schema
         */
        CollectionEcosystemReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * CollectionSuiteListResponse
         * @description Tigrbl v3 CollectionSuite list schema
         */
        CollectionSuiteListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * CollectionSuiteReadResponse
         * @description Tigrbl v3 CollectionSuite read schema
         */
        CollectionSuiteReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ContentArticleListResponse
         * @description Tigrbl v3 ContentArticle list schema
         */
        ContentArticleListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentArticleReadResponse
         * @description Tigrbl v3 ContentArticle read schema
         */
        ContentArticleReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentCaseStudyListResponse
         * @description Tigrbl v3 ContentCaseStudy list schema
         */
        ContentCaseStudyListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentCaseStudyReadResponse
         * @description Tigrbl v3 ContentCaseStudy read schema
         */
        ContentCaseStudyReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentInsightListResponse
         * @description Tigrbl v3 ContentInsight list schema
         */
        ContentInsightListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentInsightReadResponse
         * @description Tigrbl v3 ContentInsight read schema
         */
        ContentInsightReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentPodcastListResponse
         * @description Tigrbl v3 ContentPodcast list schema
         */
        ContentPodcastListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentPodcastReadResponse
         * @description Tigrbl v3 ContentPodcast read schema
         */
        ContentPodcastReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentPresentationListResponse
         * @description Tigrbl v3 ContentPresentation list schema
         */
        ContentPresentationListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentPresentationReadResponse
         * @description Tigrbl v3 ContentPresentation read schema
         */
        ContentPresentationReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentReportListResponse
         * @description Tigrbl v3 ContentReport list schema
         */
        ContentReportListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentReportReadResponse
         * @description Tigrbl v3 ContentReport read schema
         */
        ContentReportReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentVideoListResponse
         * @description Tigrbl v3 ContentVideo list schema
         */
        ContentVideoListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentVideoReadResponse
         * @description Tigrbl v3 ContentVideo read schema
         */
        ContentVideoReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentWhitepaperListResponse
         * @description Tigrbl v3 ContentWhitepaper list schema
         */
        ContentWhitepaperListResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContentWhitepaperReadResponse
         * @description Tigrbl v3 ContentWhitepaper read schema
         */
        ContentWhitepaperReadResponse: {
            /**
             * Author
             * @default null
             */
            author: string | null;
            /**
             * Body Url
             * @default null
             */
            body_url: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Slug
             * @default null
             */
            slug: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ContractAsyncapiListResponse
         * @description Tigrbl v3 ContractAsyncapi list schema
         */
        ContractAsyncapiListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractAsyncapiReadResponse
         * @description Tigrbl v3 ContractAsyncapi read schema
         */
        ContractAsyncapiReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractConfigurationSchemaListResponse
         * @description Tigrbl v3 ContractConfigurationSchema list schema
         */
        ContractConfigurationSchemaListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractConfigurationSchemaReadResponse
         * @description Tigrbl v3 ContractConfigurationSchema read schema
         */
        ContractConfigurationSchemaReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractDataSchemaListResponse
         * @description Tigrbl v3 ContractDataSchema list schema
         */
        ContractDataSchemaListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractDataSchemaReadResponse
         * @description Tigrbl v3 ContractDataSchema read schema
         */
        ContractDataSchemaReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractEventSchemaListResponse
         * @description Tigrbl v3 ContractEventSchema list schema
         */
        ContractEventSchemaListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractEventSchemaReadResponse
         * @description Tigrbl v3 ContractEventSchema read schema
         */
        ContractEventSchemaReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractGraphqlListResponse
         * @description Tigrbl v3 ContractGraphql list schema
         */
        ContractGraphqlListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractGraphqlReadResponse
         * @description Tigrbl v3 ContractGraphql read schema
         */
        ContractGraphqlReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractJsonSchemaListResponse
         * @description Tigrbl v3 ContractJsonSchema list schema
         */
        ContractJsonSchemaListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractJsonSchemaReadResponse
         * @description Tigrbl v3 ContractJsonSchema read schema
         */
        ContractJsonSchemaReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractOpenapiListResponse
         * @description Tigrbl v3 ContractOpenapi list schema
         */
        ContractOpenapiListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractOpenapiReadResponse
         * @description Tigrbl v3 ContractOpenapi read schema
         */
        ContractOpenapiReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractOpenrpcListResponse
         * @description Tigrbl v3 ContractOpenrpc list schema
         */
        ContractOpenrpcListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractOpenrpcReadResponse
         * @description Tigrbl v3 ContractOpenrpc read schema
         */
        ContractOpenrpcReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractProtobufListResponse
         * @description Tigrbl v3 ContractProtobuf list schema
         */
        ContractProtobufListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractProtobufReadResponse
         * @description Tigrbl v3 ContractProtobuf read schema
         */
        ContractProtobufReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractProtocolSpecListResponse
         * @description Tigrbl v3 ContractProtocolSpec list schema
         */
        ContractProtocolSpecListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ContractProtocolSpecReadResponse
         * @description Tigrbl v3 ContractProtocolSpec read schema
         */
        ContractProtocolSpecReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DataBenchmarkCorpusListResponse
         * @description Tigrbl v3 DataBenchmarkCorpus list schema
         */
        DataBenchmarkCorpusListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataBenchmarkCorpusReadResponse
         * @description Tigrbl v3 DataBenchmarkCorpus read schema
         */
        DataBenchmarkCorpusReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataDatasetListResponse
         * @description Tigrbl v3 DataDataset list schema
         */
        DataDatasetListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataDatasetReadResponse
         * @description Tigrbl v3 DataDataset read schema
         */
        DataDatasetReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataFixtureListResponse
         * @description Tigrbl v3 DataFixture list schema
         */
        DataFixtureListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataFixtureReadResponse
         * @description Tigrbl v3 DataFixture read schema
         */
        DataFixtureReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataMappingListResponse
         * @description Tigrbl v3 DataMapping list schema
         */
        DataMappingListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataMappingReadResponse
         * @description Tigrbl v3 DataMapping read schema
         */
        DataMappingReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataModelListResponse
         * @description Tigrbl v3 DataModel list schema
         */
        DataModelListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataModelReadResponse
         * @description Tigrbl v3 DataModel read schema
         */
        DataModelReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataVocabularyListResponse
         * @description Tigrbl v3 DataVocabulary list schema
         */
        DataVocabularyListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DataVocabularyReadResponse
         * @description Tigrbl v3 DataVocabulary read schema
         */
        DataVocabularyReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionArchiveListResponse
         * @description Tigrbl v3 DistributionArchive list schema
         */
        DistributionArchiveListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionArchiveReadResponse
         * @description Tigrbl v3 DistributionArchive read schema
         */
        DistributionArchiveReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionBinaryListResponse
         * @description Tigrbl v3 DistributionBinary list schema
         */
        DistributionBinaryListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionBinaryReadResponse
         * @description Tigrbl v3 DistributionBinary read schema
         */
        DistributionBinaryReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionBundleListResponse
         * @description Tigrbl v3 DistributionBundle list schema
         */
        DistributionBundleListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionBundleReadResponse
         * @description Tigrbl v3 DistributionBundle read schema
         */
        DistributionBundleReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionContainerImageListResponse
         * @description Tigrbl v3 DistributionContainerImage list schema
         */
        DistributionContainerImageListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DistributionContainerImageReadResponse
         * @description Tigrbl v3 DistributionContainerImage read schema
         */
        DistributionContainerImageReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * DocumentationChangelogListResponse
         * @description Tigrbl v3 DocumentationChangelog list schema
         */
        DocumentationChangelogListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationChangelogReadResponse
         * @description Tigrbl v3 DocumentationChangelog read schema
         */
        DocumentationChangelogReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationCollectionListResponse
         * @description Tigrbl v3 DocumentationCollection list schema
         */
        DocumentationCollectionListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationCollectionReadResponse
         * @description Tigrbl v3 DocumentationCollection read schema
         */
        DocumentationCollectionReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationConceptListResponse
         * @description Tigrbl v3 DocumentationConcept list schema
         */
        DocumentationConceptListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationConceptReadResponse
         * @description Tigrbl v3 DocumentationConcept read schema
         */
        DocumentationConceptReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationCookbookListResponse
         * @description Tigrbl v3 DocumentationCookbook list schema
         */
        DocumentationCookbookListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationCookbookReadResponse
         * @description Tigrbl v3 DocumentationCookbook read schema
         */
        DocumentationCookbookReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationFaqListResponse
         * @description Tigrbl v3 DocumentationFaq list schema
         */
        DocumentationFaqListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationFaqReadResponse
         * @description Tigrbl v3 DocumentationFaq read schema
         */
        DocumentationFaqReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationGuideListResponse
         * @description Tigrbl v3 DocumentationGuide list schema
         */
        DocumentationGuideListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationGuideReadResponse
         * @description Tigrbl v3 DocumentationGuide read schema
         */
        DocumentationGuideReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationHowToListResponse
         * @description Tigrbl v3 DocumentationHowTo list schema
         */
        DocumentationHowToListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationHowToReadResponse
         * @description Tigrbl v3 DocumentationHowTo read schema
         */
        DocumentationHowToReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationQuickstartListResponse
         * @description Tigrbl v3 DocumentationQuickstart list schema
         */
        DocumentationQuickstartListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationQuickstartReadResponse
         * @description Tigrbl v3 DocumentationQuickstart read schema
         */
        DocumentationQuickstartReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationReferenceListResponse
         * @description Tigrbl v3 DocumentationReference list schema
         */
        DocumentationReferenceListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationReferenceReadResponse
         * @description Tigrbl v3 DocumentationReference read schema
         */
        DocumentationReferenceReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationRunbookListResponse
         * @description Tigrbl v3 DocumentationRunbook list schema
         */
        DocumentationRunbookListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationRunbookReadResponse
         * @description Tigrbl v3 DocumentationRunbook read schema
         */
        DocumentationRunbookReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationSiteListResponse
         * @description Tigrbl v3 DocumentationSite list schema
         */
        DocumentationSiteListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationSiteReadResponse
         * @description Tigrbl v3 DocumentationSite read schema
         */
        DocumentationSiteReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationTutorialListResponse
         * @description Tigrbl v3 DocumentationTutorial list schema
         */
        DocumentationTutorialListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * DocumentationTutorialReadResponse
         * @description Tigrbl v3 DocumentationTutorial read schema
         */
        DocumentationTutorialReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * GovernanceAdrListResponse
         * @description Tigrbl v3 GovernanceAdr list schema
         */
        GovernanceAdrListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceAdrReadResponse
         * @description Tigrbl v3 GovernanceAdr read schema
         */
        GovernanceAdrReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceBoundaryListResponse
         * @description Tigrbl v3 GovernanceBoundary list schema
         */
        GovernanceBoundaryListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceBoundaryReadResponse
         * @description Tigrbl v3 GovernanceBoundary read schema
         */
        GovernanceBoundaryReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceClaimListResponse
         * @description Tigrbl v3 GovernanceClaim list schema
         */
        GovernanceClaimListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceClaimReadResponse
         * @description Tigrbl v3 GovernanceClaim read schema
         */
        GovernanceClaimReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceEvidenceListResponse
         * @description Tigrbl v3 GovernanceEvidence list schema
         */
        GovernanceEvidenceListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceEvidenceReadResponse
         * @description Tigrbl v3 GovernanceEvidence read schema
         */
        GovernanceEvidenceReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceFeatureListResponse
         * @description Tigrbl v3 GovernanceFeature list schema
         */
        GovernanceFeatureListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceFeatureReadResponse
         * @description Tigrbl v3 GovernanceFeature read schema
         */
        GovernanceFeatureReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceIssueListResponse
         * @description Tigrbl v3 GovernanceIssue list schema
         */
        GovernanceIssueListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceIssueReadResponse
         * @description Tigrbl v3 GovernanceIssue read schema
         */
        GovernanceIssueReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceProfileListResponse
         * @description Tigrbl v3 GovernanceProfile list schema
         */
        GovernanceProfileListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceProfileReadResponse
         * @description Tigrbl v3 GovernanceProfile read schema
         */
        GovernanceProfileReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceReleaseListResponse
         * @description Tigrbl v3 GovernanceRelease list schema
         */
        GovernanceReleaseListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceReleaseReadResponse
         * @description Tigrbl v3 GovernanceRelease read schema
         */
        GovernanceReleaseReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceRiskListResponse
         * @description Tigrbl v3 GovernanceRisk list schema
         */
        GovernanceRiskListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceRiskReadResponse
         * @description Tigrbl v3 GovernanceRisk read schema
         */
        GovernanceRiskReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceScopeListResponse
         * @description Tigrbl v3 GovernanceScope list schema
         */
        GovernanceScopeListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceScopeReadResponse
         * @description Tigrbl v3 GovernanceScope read schema
         */
        GovernanceScopeReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceSpecListResponse
         * @description Tigrbl v3 GovernanceSpec list schema
         */
        GovernanceSpecListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceSpecReadResponse
         * @description Tigrbl v3 GovernanceSpec read schema
         */
        GovernanceSpecReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceTestListResponse
         * @description Tigrbl v3 GovernanceTest list schema
         */
        GovernanceTestListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * GovernanceTestReadResponse
         * @description Tigrbl v3 GovernanceTest read schema
         */
        GovernanceTestReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Implementation Status
             * @default null
             */
            implementation_status: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Payload
             * @default null
             */
            payload: {
                [key: string]: unknown;
            } | null;
            /** Source Key */
            source_key: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Statement
             * @default null
             */
            statement: string | null;
            /**
             * Status
             * @default null
             */
            status: string | null;
            /**
             * Title
             * @default null
             */
            title: string | null;
        };
        /**
         * ImplementationAdapterListResponse
         * @description Tigrbl v3 ImplementationAdapter list schema
         */
        ImplementationAdapterListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationAdapterReadResponse
         * @description Tigrbl v3 ImplementationAdapter read schema
         */
        ImplementationAdapterReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationDemoListResponse
         * @description Tigrbl v3 ImplementationDemo list schema
         */
        ImplementationDemoListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationDemoReadResponse
         * @description Tigrbl v3 ImplementationDemo read schema
         */
        ImplementationDemoReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationExampleListResponse
         * @description Tigrbl v3 ImplementationExample list schema
         */
        ImplementationExampleListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationExampleReadResponse
         * @description Tigrbl v3 ImplementationExample read schema
         */
        ImplementationExampleReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationNotebookListResponse
         * @description Tigrbl v3 ImplementationNotebook list schema
         */
        ImplementationNotebookListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationNotebookReadResponse
         * @description Tigrbl v3 ImplementationNotebook read schema
         */
        ImplementationNotebookReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationPluginListResponse
         * @description Tigrbl v3 ImplementationPlugin list schema
         */
        ImplementationPluginListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationPluginReadResponse
         * @description Tigrbl v3 ImplementationPlugin read schema
         */
        ImplementationPluginReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationRecipeListResponse
         * @description Tigrbl v3 ImplementationRecipe list schema
         */
        ImplementationRecipeListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationRecipeReadResponse
         * @description Tigrbl v3 ImplementationRecipe read schema
         */
        ImplementationRecipeReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationReferenceListResponse
         * @description Tigrbl v3 ImplementationReference list schema
         */
        ImplementationReferenceListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationReferenceReadResponse
         * @description Tigrbl v3 ImplementationReference read schema
         */
        ImplementationReferenceReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationSampleApplicationListResponse
         * @description Tigrbl v3 ImplementationSampleApplication list schema
         */
        ImplementationSampleApplicationListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationSampleApplicationReadResponse
         * @description Tigrbl v3 ImplementationSampleApplication read schema
         */
        ImplementationSampleApplicationReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationShowcaseListResponse
         * @description Tigrbl v3 ImplementationShowcase list schema
         */
        ImplementationShowcaseListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationShowcaseReadResponse
         * @description Tigrbl v3 ImplementationShowcase read schema
         */
        ImplementationShowcaseReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationTemplateListResponse
         * @description Tigrbl v3 ImplementationTemplate list schema
         */
        ImplementationTemplateListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * ImplementationTemplateReadResponse
         * @description Tigrbl v3 ImplementationTemplate read schema
         */
        ImplementationTemplateReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceApiExplorerListResponse
         * @description Tigrbl v3 InterfaceApiExplorer list schema
         */
        InterfaceApiExplorerListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceApiExplorerReadResponse
         * @description Tigrbl v3 InterfaceApiExplorer read schema
         */
        InterfaceApiExplorerReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceCommandLineListResponse
         * @description Tigrbl v3 InterfaceCommandLine list schema
         */
        InterfaceCommandLineListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceCommandLineReadResponse
         * @description Tigrbl v3 InterfaceCommandLine read schema
         */
        InterfaceCommandLineReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceConsoleListResponse
         * @description Tigrbl v3 InterfaceConsole list schema
         */
        InterfaceConsoleListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceConsoleReadResponse
         * @description Tigrbl v3 InterfaceConsole read schema
         */
        InterfaceConsoleReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceDashboardListResponse
         * @description Tigrbl v3 InterfaceDashboard list schema
         */
        InterfaceDashboardListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceDashboardReadResponse
         * @description Tigrbl v3 InterfaceDashboard read schema
         */
        InterfaceDashboardReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceDesktopApplicationListResponse
         * @description Tigrbl v3 InterfaceDesktopApplication list schema
         */
        InterfaceDesktopApplicationListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceDesktopApplicationReadResponse
         * @description Tigrbl v3 InterfaceDesktopApplication read schema
         */
        InterfaceDesktopApplicationReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceDeveloperPortalListResponse
         * @description Tigrbl v3 InterfaceDeveloperPortal list schema
         */
        InterfaceDeveloperPortalListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceDeveloperPortalReadResponse
         * @description Tigrbl v3 InterfaceDeveloperPortal read schema
         */
        InterfaceDeveloperPortalReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceExtensionListResponse
         * @description Tigrbl v3 InterfaceExtension list schema
         */
        InterfaceExtensionListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceExtensionReadResponse
         * @description Tigrbl v3 InterfaceExtension read schema
         */
        InterfaceExtensionReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceGuiListResponse
         * @description Tigrbl v3 InterfaceGui list schema
         */
        InterfaceGuiListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceGuiReadResponse
         * @description Tigrbl v3 InterfaceGui read schema
         */
        InterfaceGuiReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceMobileApplicationListResponse
         * @description Tigrbl v3 InterfaceMobileApplication list schema
         */
        InterfaceMobileApplicationListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceMobileApplicationReadResponse
         * @description Tigrbl v3 InterfaceMobileApplication read schema
         */
        InterfaceMobileApplicationReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfacePlaygroundListResponse
         * @description Tigrbl v3 InterfacePlayground list schema
         */
        InterfacePlaygroundListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfacePlaygroundReadResponse
         * @description Tigrbl v3 InterfacePlayground read schema
         */
        InterfacePlaygroundReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceWebApplicationListResponse
         * @description Tigrbl v3 InterfaceWebApplication list schema
         */
        InterfaceWebApplicationListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceWebApplicationReadResponse
         * @description Tigrbl v3 InterfaceWebApplication read schema
         */
        InterfaceWebApplicationReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceWebsiteListResponse
         * @description Tigrbl v3 InterfaceWebsite list schema
         */
        InterfaceWebsiteListResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * InterfaceWebsiteReadResponse
         * @description Tigrbl v3 InterfaceWebsite read schema
         */
        InterfaceWebsiteReadResponse: {
            /**
             * Canonical Path
             * @default null
             */
            canonical_path: string | null;
            /**
             * Http Status
             * @default null
             */
            http_status: number | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Last Checked At
             * @default null
             */
            last_checked_at: string | null;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Reachability
             * @default null
             */
            reachability: string;
            /**
             * Repository Path
             * @default null
             */
            repository_path: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /** Title */
            title: string;
            /** Url */
            url: string;
        };
        /**
         * LegalAttributionListResponse
         * @description Tigrbl v3 LegalAttribution list schema
         */
        LegalAttributionListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalAttributionReadResponse
         * @description Tigrbl v3 LegalAttribution read schema
         */
        LegalAttributionReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalContributorAgreementListResponse
         * @description Tigrbl v3 LegalContributorAgreement list schema
         */
        LegalContributorAgreementListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalContributorAgreementReadResponse
         * @description Tigrbl v3 LegalContributorAgreement read schema
         */
        LegalContributorAgreementReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalLicenseListResponse
         * @description Tigrbl v3 LegalLicense list schema
         */
        LegalLicenseListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalLicenseReadResponse
         * @description Tigrbl v3 LegalLicense read schema
         */
        LegalLicenseReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalNoticeListResponse
         * @description Tigrbl v3 LegalNotice list schema
         */
        LegalNoticeListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalNoticeReadResponse
         * @description Tigrbl v3 LegalNotice read schema
         */
        LegalNoticeReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalPolicyListResponse
         * @description Tigrbl v3 LegalPolicy list schema
         */
        LegalPolicyListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalPolicyReadResponse
         * @description Tigrbl v3 LegalPolicy read schema
         */
        LegalPolicyReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalSecurityPolicyListResponse
         * @description Tigrbl v3 LegalSecurityPolicy list schema
         */
        LegalSecurityPolicyListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalSecurityPolicyReadResponse
         * @description Tigrbl v3 LegalSecurityPolicy read schema
         */
        LegalSecurityPolicyReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalTermsListResponse
         * @description Tigrbl v3 LegalTerms list schema
         */
        LegalTermsListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * LegalTermsReadResponse
         * @description Tigrbl v3 LegalTerms read schema
         */
        LegalTermsReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * OfferingServiceListResponse
         * @description Tigrbl v3 OfferingService list schema
         */
        OfferingServiceListResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * OfferingServiceReadResponse
         * @description Tigrbl v3 OfferingService read schema
         */
        OfferingServiceReadResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * OfferingSolutionListResponse
         * @description Tigrbl v3 OfferingSolution list schema
         */
        OfferingSolutionListResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * OfferingSolutionReadResponse
         * @description Tigrbl v3 OfferingSolution read schema
         */
        OfferingSolutionReadResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * OrganizationListResponse
         * @description Tigrbl v3 Organization list schema
         */
        OrganizationListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * OrganizationReadResponse
         * @description Tigrbl v3 Organization read schema
         */
        OrganizationReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Summary
             * @default null
             */
            summary: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * PackageListResponse
         * @description Tigrbl v3 Package list schema
         */
        PackageListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** Ecosystem */
            ecosystem: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Latest Version
             * @default null
             */
            latest_version: string | null;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /**
             * License Status
             * @default null
             */
            license_status: string | null;
            /**
             * Manifest Path
             * @default null
             */
            manifest_path: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Package Kind
             * @default null
             */
            package_kind: string;
            /**
             * Private
             * @default null
             */
            private: boolean;
            /**
             * Publication Status
             * @default null
             */
            publication_status: string | null;
            /**
             * Published
             * @default null
             */
            published: boolean | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Registry Url
             * @default null
             */
            registry_url: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PackageReadResponse
         * @description Tigrbl v3 Package read schema
         */
        PackageReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /** Ecosystem */
            ecosystem: string;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Latest Version
             * @default null
             */
            latest_version: string | null;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /**
             * License Status
             * @default null
             */
            license_status: string | null;
            /**
             * Manifest Path
             * @default null
             */
            manifest_path: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Package Kind
             * @default null
             */
            package_kind: string;
            /**
             * Private
             * @default null
             */
            private: boolean;
            /**
             * Publication Status
             * @default null
             */
            publication_status: string | null;
            /**
             * Published
             * @default null
             */
            published: boolean | null;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /**
             * Registry Url
             * @default null
             */
            registry_url: string | null;
            /**
             * Route Key
             * @default null
             */
            route_key: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PartyPersonListResponse
         * @description Tigrbl v3 PartyPerson list schema
         */
        PartyPersonListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PartyPersonReadResponse
         * @description Tigrbl v3 PartyPerson read schema
         */
        PartyPersonReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PartyTeamListResponse
         * @description Tigrbl v3 PartyTeam list schema
         */
        PartyTeamListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PartyTeamReadResponse
         * @description Tigrbl v3 PartyTeam read schema
         */
        PartyTeamReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * PortfolioListResponse
         * @description Tigrbl v3 Portfolio list schema
         */
        PortfolioListResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Focus
             * @default null
             */
            focus: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * PortfolioReadResponse
         * @description Tigrbl v3 Portfolio read schema
         */
        PortfolioReadResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Focus
             * @default null
             */
            focus: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ProductListResponse
         * @description Tigrbl v3 Product list schema
         */
        ProductListResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ProductReadResponse
         * @description Tigrbl v3 Product read schema
         */
        ProductReadResponse: {
            /**
             * Body Markdown
             * @default null
             */
            body_markdown: string | null;
            /**
             * Canonical Url
             * @default null
             */
            canonical_url: string | null;
            /**
             * Content Revision
             * @default null
             */
            content_revision: number;
            /**
             * Eyebrow
             * @default null
             */
            eyebrow: string | null;
            /**
             * Featured
             * @default null
             */
            featured: boolean;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Maturity
             * @default null
             */
            maturity: string | null;
            /** Name */
            name: string;
            /**
             * Published At
             * @default null
             */
            published_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /** Summary */
            summary: string;
            /**
             * Updated At
             * @default null
             */
            updated_at: string | null;
            /**
             * Visibility
             * @default null
             */
            visibility: string;
        };
        /**
         * ReleaseBinaryListResponse
         * @description Tigrbl v3 ReleaseBinary list schema
         */
        ReleaseBinaryListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseBinaryReadResponse
         * @description Tigrbl v3 ReleaseBinary read schema
         */
        ReleaseBinaryReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseBundleListResponse
         * @description Tigrbl v3 ReleaseBundle list schema
         */
        ReleaseBundleListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseBundleReadResponse
         * @description Tigrbl v3 ReleaseBundle read schema
         */
        ReleaseBundleReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseContainerListResponse
         * @description Tigrbl v3 ReleaseContainer list schema
         */
        ReleaseContainerListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseContainerReadResponse
         * @description Tigrbl v3 ReleaseContainer read schema
         */
        ReleaseContainerReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleasePackageListResponse
         * @description Tigrbl v3 ReleasePackage list schema
         */
        ReleasePackageListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleasePackageReadResponse
         * @description Tigrbl v3 ReleasePackage read schema
         */
        ReleasePackageReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseRepositoryListResponse
         * @description Tigrbl v3 ReleaseRepository list schema
         */
        ReleaseRepositoryListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * ReleaseRepositoryReadResponse
         * @description Tigrbl v3 ReleaseRepository read schema
         */
        ReleaseRepositoryReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RepositoryListResponse
         * @description Tigrbl v3 Repository list schema
         */
        RepositoryListResponse: {
            /**
             * Default Branch
             * @default null
             */
            default_branch: string | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Is Archived
             * @default null
             */
            is_archived: boolean;
            /**
             * Is Fork
             * @default null
             */
            is_fork: boolean;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Owner */
            owner: string;
            /** Provider */
            provider: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Ssot Governed
             * @default null
             */
            ssot_governed: boolean;
            /**
             * Ssot Observed At
             * @default null
             */
            ssot_observed_at: string | null;
            /**
             * Ssot Registry Sha256
             * @default null
             */
            ssot_registry_sha256: string | null;
            /**
             * Ssot Registry Url
             * @default null
             */
            ssot_registry_url: string | null;
            /**
             * Ssot Schema Version
             * @default null
             */
            ssot_schema_version: string | null;
            /**
             * Ssot Summary
             * @default null
             */
            ssot_summary: {
                [key: string]: unknown;
            } | null;
            /** Url */
            url: string;
        };
        /**
         * RepositoryReadResponse
         * @description Tigrbl v3 Repository read schema
         */
        RepositoryReadResponse: {
            /**
             * Default Branch
             * @default null
             */
            default_branch: string | null;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Is Archived
             * @default null
             */
            is_archived: boolean;
            /**
             * Is Fork
             * @default null
             */
            is_fork: boolean;
            /**
             * License Expression
             * @default null
             */
            license_expression: string | null;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Owner */
            owner: string;
            /** Provider */
            provider: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Ssot Governed
             * @default null
             */
            ssot_governed: boolean;
            /**
             * Ssot Observed At
             * @default null
             */
            ssot_observed_at: string | null;
            /**
             * Ssot Registry Sha256
             * @default null
             */
            ssot_registry_sha256: string | null;
            /**
             * Ssot Registry Url
             * @default null
             */
            ssot_registry_url: string | null;
            /**
             * Ssot Schema Version
             * @default null
             */
            ssot_schema_version: string | null;
            /**
             * Ssot Summary
             * @default null
             */
            ssot_summary: {
                [key: string]: unknown;
            } | null;
            /** Url */
            url: string;
        };
        /**
         * RepositorySsotRegistryListResponse
         * @description Tigrbl v3 RepositorySsotRegistry list schema
         */
        RepositorySsotRegistryListResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Registry Url */
            registry_url: string;
            /**
             * Schema Version
             * @default null
             */
            schema_version: string | null;
            /**
             * Source Sha256
             * @default null
             */
            source_sha256: string | null;
            /**
             * Valid
             * @default null
             */
            valid: boolean;
        };
        /**
         * RepositorySsotRegistryReadResponse
         * @description Tigrbl v3 RepositorySsotRegistry read schema
         */
        RepositorySsotRegistryReadResponse: {
            /**
             * Id
             * @default null
             */
            id: string;
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Registry Url */
            registry_url: string;
            /**
             * Schema Version
             * @default null
             */
            schema_version: string | null;
            /**
             * Source Sha256
             * @default null
             */
            source_sha256: string | null;
            /**
             * Valid
             * @default null
             */
            valid: boolean;
        };
        /**
         * RuntimeApiListResponse
         * @description Tigrbl v3 RuntimeApi list schema
         */
        RuntimeApiListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeApiReadResponse
         * @description Tigrbl v3 RuntimeApi read schema
         */
        RuntimeApiReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeDeploymentListResponse
         * @description Tigrbl v3 RuntimeDeployment list schema
         */
        RuntimeDeploymentListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeDeploymentReadResponse
         * @description Tigrbl v3 RuntimeDeployment read schema
         */
        RuntimeDeploymentReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeDeploymentTargetListResponse
         * @description Tigrbl v3 RuntimeDeploymentTarget list schema
         */
        RuntimeDeploymentTargetListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeDeploymentTargetReadResponse
         * @description Tigrbl v3 RuntimeDeploymentTarget read schema
         */
        RuntimeDeploymentTargetReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeEndpointListResponse
         * @description Tigrbl v3 RuntimeEndpoint list schema
         */
        RuntimeEndpointListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeEndpointReadResponse
         * @description Tigrbl v3 RuntimeEndpoint read schema
         */
        RuntimeEndpointReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeEnvironmentListResponse
         * @description Tigrbl v3 RuntimeEnvironment list schema
         */
        RuntimeEnvironmentListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeEnvironmentReadResponse
         * @description Tigrbl v3 RuntimeEnvironment read schema
         */
        RuntimeEnvironmentReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeGatewayListResponse
         * @description Tigrbl v3 RuntimeGateway list schema
         */
        RuntimeGatewayListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeGatewayReadResponse
         * @description Tigrbl v3 RuntimeGateway read schema
         */
        RuntimeGatewayReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeScheduledJobListResponse
         * @description Tigrbl v3 RuntimeScheduledJob list schema
         */
        RuntimeScheduledJobListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeScheduledJobReadResponse
         * @description Tigrbl v3 RuntimeScheduledJob read schema
         */
        RuntimeScheduledJobReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeServiceListResponse
         * @description Tigrbl v3 RuntimeService list schema
         */
        RuntimeServiceListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeServiceReadResponse
         * @description Tigrbl v3 RuntimeService read schema
         */
        RuntimeServiceReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeWebhookListResponse
         * @description Tigrbl v3 RuntimeWebhook list schema
         */
        RuntimeWebhookListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeWebhookReadResponse
         * @description Tigrbl v3 RuntimeWebhook read schema
         */
        RuntimeWebhookReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeWorkerListResponse
         * @description Tigrbl v3 RuntimeWorker list schema
         */
        RuntimeWorkerListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * RuntimeWorkerReadResponse
         * @description Tigrbl v3 RuntimeWorker read schema
         */
        RuntimeWorkerReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceBranchListResponse
         * @description Tigrbl v3 SourceBranch list schema
         */
        SourceBranchListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceBranchReadResponse
         * @description Tigrbl v3 SourceBranch read schema
         */
        SourceBranchReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceCommitListResponse
         * @description Tigrbl v3 SourceCommit list schema
         */
        SourceCommitListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceCommitReadResponse
         * @description Tigrbl v3 SourceCommit read schema
         */
        SourceCommitReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceTagListResponse
         * @description Tigrbl v3 SourceTag list schema
         */
        SourceTagListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceTagReadResponse
         * @description Tigrbl v3 SourceTag read schema
         */
        SourceTagReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceWorkspaceListResponse
         * @description Tigrbl v3 SourceWorkspace list schema
         */
        SourceWorkspaceListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * SourceWorkspaceReadResponse
         * @description Tigrbl v3 SourceWorkspace read schema
         */
        SourceWorkspaceReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyAudienceListResponse
         * @description Tigrbl v3 TaxonomyAudience list schema
         */
        TaxonomyAudienceListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyAudienceReadResponse
         * @description Tigrbl v3 TaxonomyAudience read schema
         */
        TaxonomyAudienceReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyCapabilityListResponse
         * @description Tigrbl v3 TaxonomyCapability list schema
         */
        TaxonomyCapabilityListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyCapabilityReadResponse
         * @description Tigrbl v3 TaxonomyCapability read schema
         */
        TaxonomyCapabilityReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyCategoryListResponse
         * @description Tigrbl v3 TaxonomyCategory list schema
         */
        TaxonomyCategoryListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyCategoryReadResponse
         * @description Tigrbl v3 TaxonomyCategory read schema
         */
        TaxonomyCategoryReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyDomainListResponse
         * @description Tigrbl v3 TaxonomyDomain list schema
         */
        TaxonomyDomainListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyDomainReadResponse
         * @description Tigrbl v3 TaxonomyDomain read schema
         */
        TaxonomyDomainReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyEcosystemListResponse
         * @description Tigrbl v3 TaxonomyEcosystem list schema
         */
        TaxonomyEcosystemListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyEcosystemReadResponse
         * @description Tigrbl v3 TaxonomyEcosystem read schema
         */
        TaxonomyEcosystemReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyLanguageListResponse
         * @description Tigrbl v3 TaxonomyLanguage list schema
         */
        TaxonomyLanguageListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyLanguageReadResponse
         * @description Tigrbl v3 TaxonomyLanguage read schema
         */
        TaxonomyLanguageReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyTopicListResponse
         * @description Tigrbl v3 TaxonomyTopic list schema
         */
        TaxonomyTopicListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TaxonomyTopicReadResponse
         * @description Tigrbl v3 TaxonomyTopic read schema
         */
        TaxonomyTopicReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * TechnologyListResponse
         * @description Tigrbl v3 Technology list schema
         */
        TechnologyListResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Icon Key
             * @default null
             */
            icon_key: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * TechnologyReadResponse
         * @description Tigrbl v3 Technology read schema
         */
        TechnologyReadResponse: {
            /** Category */
            category: string;
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Icon Key
             * @default null
             */
            icon_key: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /** Slug */
            slug: string;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
            /**
             * Website Url
             * @default null
             */
            website_url: string | null;
        };
        /**
         * WorkDiscussionListResponse
         * @description Tigrbl v3 WorkDiscussion list schema
         */
        WorkDiscussionListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkDiscussionReadResponse
         * @description Tigrbl v3 WorkDiscussion read schema
         */
        WorkDiscussionReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkIssueListResponse
         * @description Tigrbl v3 WorkIssue list schema
         */
        WorkIssueListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkIssueReadResponse
         * @description Tigrbl v3 WorkIssue read schema
         */
        WorkIssueReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkMilestoneListResponse
         * @description Tigrbl v3 WorkMilestone list schema
         */
        WorkMilestoneListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkMilestoneReadResponse
         * @description Tigrbl v3 WorkMilestone read schema
         */
        WorkMilestoneReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkProjectListResponse
         * @description Tigrbl v3 WorkProject list schema
         */
        WorkProjectListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkProjectReadResponse
         * @description Tigrbl v3 WorkProject read schema
         */
        WorkProjectReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkPullRequestListResponse
         * @description Tigrbl v3 WorkPullRequest list schema
         */
        WorkPullRequestListResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
        /**
         * WorkPullRequestReadResponse
         * @description Tigrbl v3 WorkPullRequest read schema
         */
        WorkPullRequestReadResponse: {
            /**
             * Description
             * @default null
             */
            description: string | null;
            /**
             * Id
             * @default null
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Observed At
             * @default null
             */
            observed_at: string | null;
            /**
             * Source Payload
             * @default null
             */
            source_payload: {
                [key: string]: unknown;
            } | null;
            /**
             * Source Url
             * @default null
             */
            source_url: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "ActivityBuildRun.list": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityBuildRunListResponse"];
                };
            };
        };
    };
    "ActivityBuildRun.read": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityBuildRunReadResponse"];
                };
            };
        };
    };
    "ActivityDeploymentRun.list": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityDeploymentRunListResponse"];
                };
            };
        };
    };
    "ActivityDeploymentRun.read": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityDeploymentRunReadResponse"];
                };
            };
        };
    };
    "ActivityPublicationRun.list": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityPublicationRunListResponse"];
                };
            };
        };
    };
    "ActivityPublicationRun.read": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityPublicationRunReadResponse"];
                };
            };
        };
    };
    "ActivityTestRun.list": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityTestRunListResponse"];
                };
            };
        };
    };
    "ActivityTestRun.read": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityTestRunReadResponse"];
                };
            };
        };
    };
    "ActivityWorkflowRun.list": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityWorkflowRunListResponse"];
                };
            };
        };
    };
    "ActivityWorkflowRun.read": {
        parameters: {
            query?: {
                id?: string;
                status?: string;
                actor?: string;
                started_at?: string;
                completed_at?: string;
                result?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityWorkflowRunReadResponse"];
                };
            };
        };
    };
    catalog: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_packages: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_package: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                route_key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_release: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                route_key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_repositories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_repository: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                owner: string;
                repository: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_resources: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_resource: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                resource_type: string;
                route_key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_technologies: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    catalog_technology: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    entities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    entity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entity_type: string;
                entity_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    insights: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    organization: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    portfolios: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    portfolio: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    products: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    product: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    repository_metrics: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    services: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    service: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    solutions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    solution: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "ArtifactAttestation.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactAttestationListResponse"];
                };
            };
        };
    };
    "ArtifactAttestation.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactAttestationReadResponse"];
                };
            };
        };
    };
    "ArtifactAuditReport.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactAuditReportListResponse"];
                };
            };
        };
    };
    "ArtifactAuditReport.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactAuditReportReadResponse"];
                };
            };
        };
    };
    "ArtifactBenchmarkReport.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactBenchmarkReportListResponse"];
                };
            };
        };
    };
    "ArtifactBenchmarkReport.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactBenchmarkReportReadResponse"];
                };
            };
        };
    };
    "ArtifactBuild.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactBuildListResponse"];
                };
            };
        };
    };
    "ArtifactBuild.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactBuildReadResponse"];
                };
            };
        };
    };
    "ArtifactCoverageReport.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactCoverageReportListResponse"];
                };
            };
        };
    };
    "ArtifactCoverageReport.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactCoverageReportReadResponse"];
                };
            };
        };
    };
    "ArtifactGeneratedDocument.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactGeneratedDocumentListResponse"];
                };
            };
        };
    };
    "ArtifactGeneratedDocument.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactGeneratedDocumentReadResponse"];
                };
            };
        };
    };
    "ArtifactProvenanceStatement.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactProvenanceStatementListResponse"];
                };
            };
        };
    };
    "ArtifactProvenanceStatement.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactProvenanceStatementReadResponse"];
                };
            };
        };
    };
    "ArtifactPublicationRecord.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactPublicationRecordListResponse"];
                };
            };
        };
    };
    "ArtifactPublicationRecord.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactPublicationRecordReadResponse"];
                };
            };
        };
    };
    "ArtifactSecurityReport.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactSecurityReportListResponse"];
                };
            };
        };
    };
    "ArtifactSecurityReport.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactSecurityReportReadResponse"];
                };
            };
        };
    };
    "ArtifactTestReport.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactTestReportListResponse"];
                };
            };
        };
    };
    "ArtifactTestReport.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ArtifactTestReportReadResponse"];
                };
            };
        };
    };
    "AssetArchive.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetArchiveListResponse"];
                };
            };
        };
    };
    "AssetArchive.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetArchiveReadResponse"];
                };
            };
        };
    };
    "AssetAudio.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetAudioListResponse"];
                };
            };
        };
    };
    "AssetAudio.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetAudioReadResponse"];
                };
            };
        };
    };
    "AssetDiagram.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetDiagramListResponse"];
                };
            };
        };
    };
    "AssetDiagram.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetDiagramReadResponse"];
                };
            };
        };
    };
    "AssetDocument.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetDocumentListResponse"];
                };
            };
        };
    };
    "AssetDocument.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetDocumentReadResponse"];
                };
            };
        };
    };
    "AssetFont.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetFontListResponse"];
                };
            };
        };
    };
    "AssetFont.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetFontReadResponse"];
                };
            };
        };
    };
    "AssetIcon.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetIconListResponse"];
                };
            };
        };
    };
    "AssetIcon.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetIconReadResponse"];
                };
            };
        };
    };
    "AssetImage.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetImageListResponse"];
                };
            };
        };
    };
    "AssetImage.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetImageReadResponse"];
                };
            };
        };
    };
    "AssetLogo.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetLogoListResponse"];
                };
            };
        };
    };
    "AssetLogo.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetLogoReadResponse"];
                };
            };
        };
    };
    "AssetScreenshot.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetScreenshotListResponse"];
                };
            };
        };
    };
    "AssetScreenshot.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetScreenshotReadResponse"];
                };
            };
        };
    };
    "AssetVideo.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetVideoListResponse"];
                };
            };
        };
    };
    "AssetVideo.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssetVideoReadResponse"];
                };
            };
        };
    };
    "Association.list": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssociationListResponse"];
                };
            };
        };
    };
    "Association.read": {
        parameters: {
            query?: {
                id?: string;
                source_type?: string;
                source_id?: string;
                relationship_type?: string;
                target_type?: string;
                target_id?: string;
                role?: string;
                sort_order?: number;
                attributes?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssociationReadResponse"];
                };
            };
        };
    };
    "AutomationCollector.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationCollectorListResponse"];
                };
            };
        };
    };
    "AutomationCollector.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationCollectorReadResponse"];
                };
            };
        };
    };
    "AutomationGenerator.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationGeneratorListResponse"];
                };
            };
        };
    };
    "AutomationGenerator.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationGeneratorReadResponse"];
                };
            };
        };
    };
    "AutomationGithubAction.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationGithubActionListResponse"];
                };
            };
        };
    };
    "AutomationGithubAction.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationGithubActionReadResponse"];
                };
            };
        };
    };
    "AutomationPipeline.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationPipelineListResponse"];
                };
            };
        };
    };
    "AutomationPipeline.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationPipelineReadResponse"];
                };
            };
        };
    };
    "AutomationScript.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationScriptListResponse"];
                };
            };
        };
    };
    "AutomationScript.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationScriptReadResponse"];
                };
            };
        };
    };
    "AutomationWorkflow.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationWorkflowListResponse"];
                };
            };
        };
    };
    "AutomationWorkflow.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationWorkflowReadResponse"];
                };
            };
        };
    };
    "CollectionCatalog.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionCatalogListResponse"];
                };
            };
        };
    };
    "CollectionCatalog.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionCatalogReadResponse"];
                };
            };
        };
    };
    "CollectionEcosystem.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionEcosystemListResponse"];
                };
            };
        };
    };
    "CollectionEcosystem.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionEcosystemReadResponse"];
                };
            };
        };
    };
    "CollectionSuite.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionSuiteListResponse"];
                };
            };
        };
    };
    "CollectionSuite.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionSuiteReadResponse"];
                };
            };
        };
    };
    "ContentArticle.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentArticleListResponse"];
                };
            };
        };
    };
    "ContentArticle.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentArticleReadResponse"];
                };
            };
        };
    };
    "ContentCaseStudy.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentCaseStudyListResponse"];
                };
            };
        };
    };
    "ContentCaseStudy.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentCaseStudyReadResponse"];
                };
            };
        };
    };
    "ContentInsight.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentInsightListResponse"];
                };
            };
        };
    };
    "ContentInsight.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentInsightReadResponse"];
                };
            };
        };
    };
    "ContentPodcast.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentPodcastListResponse"];
                };
            };
        };
    };
    "ContentPodcast.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentPodcastReadResponse"];
                };
            };
        };
    };
    "ContentPresentation.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentPresentationListResponse"];
                };
            };
        };
    };
    "ContentPresentation.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentPresentationReadResponse"];
                };
            };
        };
    };
    "ContentReport.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentReportListResponse"];
                };
            };
        };
    };
    "ContentReport.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentReportReadResponse"];
                };
            };
        };
    };
    "ContentVideo.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentVideoListResponse"];
                };
            };
        };
    };
    "ContentVideo.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentVideoReadResponse"];
                };
            };
        };
    };
    "ContentWhitepaper.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentWhitepaperListResponse"];
                };
            };
        };
    };
    "ContentWhitepaper.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                title?: string;
                summary?: string;
                body_url?: string;
                author?: string;
                visibility?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentWhitepaperReadResponse"];
                };
            };
        };
    };
    "ContractAsyncapi.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractAsyncapiListResponse"];
                };
            };
        };
    };
    "ContractAsyncapi.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractAsyncapiReadResponse"];
                };
            };
        };
    };
    "ContractConfigurationSchema.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractConfigurationSchemaListResponse"];
                };
            };
        };
    };
    "ContractConfigurationSchema.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractConfigurationSchemaReadResponse"];
                };
            };
        };
    };
    "ContractDataSchema.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractDataSchemaListResponse"];
                };
            };
        };
    };
    "ContractDataSchema.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractDataSchemaReadResponse"];
                };
            };
        };
    };
    "ContractEventSchema.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractEventSchemaListResponse"];
                };
            };
        };
    };
    "ContractEventSchema.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractEventSchemaReadResponse"];
                };
            };
        };
    };
    "ContractGraphql.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractGraphqlListResponse"];
                };
            };
        };
    };
    "ContractGraphql.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractGraphqlReadResponse"];
                };
            };
        };
    };
    "ContractJsonSchema.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractJsonSchemaListResponse"];
                };
            };
        };
    };
    "ContractJsonSchema.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractJsonSchemaReadResponse"];
                };
            };
        };
    };
    "ContractOpenapi.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractOpenapiListResponse"];
                };
            };
        };
    };
    "ContractOpenapi.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractOpenapiReadResponse"];
                };
            };
        };
    };
    "ContractOpenrpc.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractOpenrpcListResponse"];
                };
            };
        };
    };
    "ContractOpenrpc.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractOpenrpcReadResponse"];
                };
            };
        };
    };
    "ContractProtobuf.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractProtobufListResponse"];
                };
            };
        };
    };
    "ContractProtobuf.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractProtobufReadResponse"];
                };
            };
        };
    };
    "ContractProtocolSpec.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractProtocolSpecListResponse"];
                };
            };
        };
    };
    "ContractProtocolSpec.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContractProtocolSpecReadResponse"];
                };
            };
        };
    };
    "DataBenchmarkCorpus.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataBenchmarkCorpusListResponse"];
                };
            };
        };
    };
    "DataBenchmarkCorpus.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataBenchmarkCorpusReadResponse"];
                };
            };
        };
    };
    "DataDataset.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataDatasetListResponse"];
                };
            };
        };
    };
    "DataDataset.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataDatasetReadResponse"];
                };
            };
        };
    };
    "DataFixture.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataFixtureListResponse"];
                };
            };
        };
    };
    "DataFixture.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataFixtureReadResponse"];
                };
            };
        };
    };
    "DataMapping.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataMappingListResponse"];
                };
            };
        };
    };
    "DataMapping.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataMappingReadResponse"];
                };
            };
        };
    };
    "DataModel.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataModelListResponse"];
                };
            };
        };
    };
    "DataModel.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataModelReadResponse"];
                };
            };
        };
    };
    "DataVocabulary.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataVocabularyListResponse"];
                };
            };
        };
    };
    "DataVocabulary.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataVocabularyReadResponse"];
                };
            };
        };
    };
    "DistributionArchive.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionArchiveListResponse"];
                };
            };
        };
    };
    "DistributionArchive.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionArchiveReadResponse"];
                };
            };
        };
    };
    "DistributionBinary.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionBinaryListResponse"];
                };
            };
        };
    };
    "DistributionBinary.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionBinaryReadResponse"];
                };
            };
        };
    };
    "DistributionBundle.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionBundleListResponse"];
                };
            };
        };
    };
    "DistributionBundle.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionBundleReadResponse"];
                };
            };
        };
    };
    "DistributionContainerImage.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionContainerImageListResponse"];
                };
            };
        };
    };
    "DistributionContainerImage.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DistributionContainerImageReadResponse"];
                };
            };
        };
    };
    "DocumentationChangelog.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationChangelogListResponse"];
                };
            };
        };
    };
    "DocumentationChangelog.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationChangelogReadResponse"];
                };
            };
        };
    };
    "DocumentationCollection.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationCollectionListResponse"];
                };
            };
        };
    };
    "DocumentationCollection.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationCollectionReadResponse"];
                };
            };
        };
    };
    "DocumentationConcept.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationConceptListResponse"];
                };
            };
        };
    };
    "DocumentationConcept.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationConceptReadResponse"];
                };
            };
        };
    };
    "DocumentationCookbook.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationCookbookListResponse"];
                };
            };
        };
    };
    "DocumentationCookbook.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationCookbookReadResponse"];
                };
            };
        };
    };
    "DocumentationFaq.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationFaqListResponse"];
                };
            };
        };
    };
    "DocumentationFaq.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationFaqReadResponse"];
                };
            };
        };
    };
    "DocumentationGuide.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationGuideListResponse"];
                };
            };
        };
    };
    "DocumentationGuide.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationGuideReadResponse"];
                };
            };
        };
    };
    "DocumentationHowTo.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationHowToListResponse"];
                };
            };
        };
    };
    "DocumentationHowTo.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationHowToReadResponse"];
                };
            };
        };
    };
    "DocumentationQuickstart.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationQuickstartListResponse"];
                };
            };
        };
    };
    "DocumentationQuickstart.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationQuickstartReadResponse"];
                };
            };
        };
    };
    "DocumentationReference.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationReferenceListResponse"];
                };
            };
        };
    };
    "DocumentationReference.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationReferenceReadResponse"];
                };
            };
        };
    };
    "DocumentationRunbook.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationRunbookListResponse"];
                };
            };
        };
    };
    "DocumentationRunbook.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationRunbookReadResponse"];
                };
            };
        };
    };
    "DocumentationSite.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationSiteListResponse"];
                };
            };
        };
    };
    "DocumentationSite.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationSiteReadResponse"];
                };
            };
        };
    };
    "DocumentationTutorial.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationTutorialListResponse"];
                };
            };
        };
    };
    "DocumentationTutorial.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentationTutorialReadResponse"];
                };
            };
        };
    };
    "GovernanceAdr.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceAdrListResponse"];
                };
            };
        };
    };
    "GovernanceAdr.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceAdrReadResponse"];
                };
            };
        };
    };
    "GovernanceBoundary.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceBoundaryListResponse"];
                };
            };
        };
    };
    "GovernanceBoundary.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceBoundaryReadResponse"];
                };
            };
        };
    };
    "GovernanceClaim.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceClaimListResponse"];
                };
            };
        };
    };
    "GovernanceClaim.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceClaimReadResponse"];
                };
            };
        };
    };
    "GovernanceEvidence.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceEvidenceListResponse"];
                };
            };
        };
    };
    "GovernanceEvidence.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceEvidenceReadResponse"];
                };
            };
        };
    };
    "GovernanceFeature.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceFeatureListResponse"];
                };
            };
        };
    };
    "GovernanceFeature.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceFeatureReadResponse"];
                };
            };
        };
    };
    "GovernanceIssue.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceIssueListResponse"];
                };
            };
        };
    };
    "GovernanceIssue.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceIssueReadResponse"];
                };
            };
        };
    };
    "GovernanceProfile.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceProfileListResponse"];
                };
            };
        };
    };
    "GovernanceProfile.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceProfileReadResponse"];
                };
            };
        };
    };
    "GovernanceRelease.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceReleaseListResponse"];
                };
            };
        };
    };
    "GovernanceRelease.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceReleaseReadResponse"];
                };
            };
        };
    };
    "GovernanceRisk.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceRiskListResponse"];
                };
            };
        };
    };
    "GovernanceRisk.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceRiskReadResponse"];
                };
            };
        };
    };
    "GovernanceScope.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceScopeListResponse"];
                };
            };
        };
    };
    "GovernanceScope.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceScopeReadResponse"];
                };
            };
        };
    };
    "GovernanceSpec.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceSpecListResponse"];
                };
            };
        };
    };
    "GovernanceSpec.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceSpecReadResponse"];
                };
            };
        };
    };
    "GovernanceTest.list": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceTestListResponse"];
                };
            };
        };
    };
    "GovernanceTest.read": {
        parameters: {
            query?: {
                id?: string;
                source_key?: string;
                title?: string;
                statement?: string;
                status?: string;
                implementation_status?: string;
                source_url?: string;
                payload?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GovernanceTestReadResponse"];
                };
            };
        };
    };
    healthz: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "ImplementationAdapter.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationAdapterListResponse"];
                };
            };
        };
    };
    "ImplementationAdapter.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationAdapterReadResponse"];
                };
            };
        };
    };
    "ImplementationDemo.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationDemoListResponse"];
                };
            };
        };
    };
    "ImplementationDemo.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationDemoReadResponse"];
                };
            };
        };
    };
    "ImplementationExample.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationExampleListResponse"];
                };
            };
        };
    };
    "ImplementationExample.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationExampleReadResponse"];
                };
            };
        };
    };
    "ImplementationNotebook.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationNotebookListResponse"];
                };
            };
        };
    };
    "ImplementationNotebook.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationNotebookReadResponse"];
                };
            };
        };
    };
    "ImplementationPlugin.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationPluginListResponse"];
                };
            };
        };
    };
    "ImplementationPlugin.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationPluginReadResponse"];
                };
            };
        };
    };
    "ImplementationRecipe.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationRecipeListResponse"];
                };
            };
        };
    };
    "ImplementationRecipe.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationRecipeReadResponse"];
                };
            };
        };
    };
    "ImplementationReference.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationReferenceListResponse"];
                };
            };
        };
    };
    "ImplementationReference.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationReferenceReadResponse"];
                };
            };
        };
    };
    "ImplementationSampleApplication.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationSampleApplicationListResponse"];
                };
            };
        };
    };
    "ImplementationSampleApplication.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationSampleApplicationReadResponse"];
                };
            };
        };
    };
    "ImplementationShowcase.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationShowcaseListResponse"];
                };
            };
        };
    };
    "ImplementationShowcase.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationShowcaseReadResponse"];
                };
            };
        };
    };
    "ImplementationTemplate.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationTemplateListResponse"];
                };
            };
        };
    };
    "ImplementationTemplate.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImplementationTemplateReadResponse"];
                };
            };
        };
    };
    "InterfaceApiExplorer.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceApiExplorerListResponse"];
                };
            };
        };
    };
    "InterfaceApiExplorer.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceApiExplorerReadResponse"];
                };
            };
        };
    };
    "InterfaceCommandLine.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceCommandLineListResponse"];
                };
            };
        };
    };
    "InterfaceCommandLine.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceCommandLineReadResponse"];
                };
            };
        };
    };
    "InterfaceConsole.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceConsoleListResponse"];
                };
            };
        };
    };
    "InterfaceConsole.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceConsoleReadResponse"];
                };
            };
        };
    };
    "InterfaceDashboard.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceDashboardListResponse"];
                };
            };
        };
    };
    "InterfaceDashboard.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceDashboardReadResponse"];
                };
            };
        };
    };
    "InterfaceDesktopApplication.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceDesktopApplicationListResponse"];
                };
            };
        };
    };
    "InterfaceDesktopApplication.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceDesktopApplicationReadResponse"];
                };
            };
        };
    };
    "InterfaceDeveloperPortal.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceDeveloperPortalListResponse"];
                };
            };
        };
    };
    "InterfaceDeveloperPortal.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceDeveloperPortalReadResponse"];
                };
            };
        };
    };
    "InterfaceExtension.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceExtensionListResponse"];
                };
            };
        };
    };
    "InterfaceExtension.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceExtensionReadResponse"];
                };
            };
        };
    };
    "InterfaceGui.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceGuiListResponse"];
                };
            };
        };
    };
    "InterfaceGui.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceGuiReadResponse"];
                };
            };
        };
    };
    "InterfaceMobileApplication.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceMobileApplicationListResponse"];
                };
            };
        };
    };
    "InterfaceMobileApplication.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceMobileApplicationReadResponse"];
                };
            };
        };
    };
    "InterfacePlayground.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfacePlaygroundListResponse"];
                };
            };
        };
    };
    "InterfacePlayground.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfacePlaygroundReadResponse"];
                };
            };
        };
    };
    "InterfaceWebApplication.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceWebApplicationListResponse"];
                };
            };
        };
    };
    "InterfaceWebApplication.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceWebApplicationReadResponse"];
                };
            };
        };
    };
    "InterfaceWebsite.list": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceWebsiteListResponse"];
                };
            };
        };
    };
    "InterfaceWebsite.read": {
        parameters: {
            query?: {
                id?: string;
                title?: string;
                summary?: string;
                url?: string;
                canonical_path?: string;
                source_url?: string;
                repository_path?: string;
                reachability?: string;
                http_status?: string;
                last_checked_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterfaceWebsiteReadResponse"];
                };
            };
        };
    };
    "LegalAttribution.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalAttributionListResponse"];
                };
            };
        };
    };
    "LegalAttribution.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalAttributionReadResponse"];
                };
            };
        };
    };
    "LegalContributorAgreement.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalContributorAgreementListResponse"];
                };
            };
        };
    };
    "LegalContributorAgreement.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalContributorAgreementReadResponse"];
                };
            };
        };
    };
    "LegalLicense.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalLicenseListResponse"];
                };
            };
        };
    };
    "LegalLicense.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalLicenseReadResponse"];
                };
            };
        };
    };
    "LegalNotice.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalNoticeListResponse"];
                };
            };
        };
    };
    "LegalNotice.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalNoticeReadResponse"];
                };
            };
        };
    };
    "LegalPolicy.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalPolicyListResponse"];
                };
            };
        };
    };
    "LegalPolicy.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalPolicyReadResponse"];
                };
            };
        };
    };
    "LegalSecurityPolicy.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalSecurityPolicyListResponse"];
                };
            };
        };
    };
    "LegalSecurityPolicy.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalSecurityPolicyReadResponse"];
                };
            };
        };
    };
    "LegalTerms.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalTermsListResponse"];
                };
            };
        };
    };
    "LegalTerms.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalTermsReadResponse"];
                };
            };
        };
    };
    "OfferingService.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                observed_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OfferingServiceListResponse"];
                };
            };
        };
    };
    "OfferingService.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                observed_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OfferingServiceReadResponse"];
                };
            };
        };
    };
    "OfferingSolution.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                observed_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OfferingSolutionListResponse"];
                };
            };
        };
    };
    "OfferingSolution.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                observed_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OfferingSolutionReadResponse"];
                };
            };
        };
    };
    "Organization.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationListResponse"];
                };
            };
        };
    };
    "Organization.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                summary?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationReadResponse"];
                };
            };
        };
    };
    "Package.list": {
        parameters: {
            query?: {
                id?: string;
                ecosystem?: string;
                name?: string;
                registry_url?: string;
                source_url?: string;
                manifest_path?: string;
                package_kind?: string;
                private?: boolean;
                description?: string;
                latest_version?: string;
                published?: string;
                publication_status?: string;
                route_key?: string;
                license_expression?: string;
                license_status?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageListResponse"];
                };
            };
        };
    };
    "Package.read": {
        parameters: {
            query?: {
                id?: string;
                ecosystem?: string;
                name?: string;
                registry_url?: string;
                source_url?: string;
                manifest_path?: string;
                package_kind?: string;
                private?: boolean;
                description?: string;
                latest_version?: string;
                published?: string;
                publication_status?: string;
                route_key?: string;
                license_expression?: string;
                license_status?: string;
                published_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PackageReadResponse"];
                };
            };
        };
    };
    "PartyPerson.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PartyPersonListResponse"];
                };
            };
        };
    };
    "PartyPerson.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PartyPersonReadResponse"];
                };
            };
        };
    };
    "PartyTeam.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PartyTeamListResponse"];
                };
            };
        };
    };
    "PartyTeam.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PartyTeamReadResponse"];
                };
            };
        };
    };
    "Portfolio.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                focus?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioListResponse"];
                };
            };
        };
    };
    "Portfolio.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                focus?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortfolioReadResponse"];
                };
            };
        };
    };
    "Product.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductListResponse"];
                };
            };
        };
    };
    "Product.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                eyebrow?: string;
                summary?: string;
                body_markdown?: string;
                maturity?: string;
                visibility?: string;
                featured?: boolean;
                canonical_url?: string;
                source_url?: string;
                published_at?: string;
                updated_at?: string;
                content_revision?: number;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductReadResponse"];
                };
            };
        };
    };
    "ReleaseBinary.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseBinaryListResponse"];
                };
            };
        };
    };
    "ReleaseBinary.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseBinaryReadResponse"];
                };
            };
        };
    };
    "ReleaseBundle.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseBundleListResponse"];
                };
            };
        };
    };
    "ReleaseBundle.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseBundleReadResponse"];
                };
            };
        };
    };
    "ReleaseContainer.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseContainerListResponse"];
                };
            };
        };
    };
    "ReleaseContainer.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseContainerReadResponse"];
                };
            };
        };
    };
    "ReleasePackage.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleasePackageListResponse"];
                };
            };
        };
    };
    "ReleasePackage.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleasePackageReadResponse"];
                };
            };
        };
    };
    "ReleaseRepository.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseRepositoryListResponse"];
                };
            };
        };
    };
    "ReleaseRepository.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseRepositoryReadResponse"];
                };
            };
        };
    };
    "Repository.list": {
        parameters: {
            query?: {
                id?: string;
                provider?: string;
                owner?: string;
                name?: string;
                url?: string;
                description?: string;
                default_branch?: string;
                is_archived?: boolean;
                is_fork?: boolean;
                license_expression?: string;
                ssot_governed?: boolean;
                ssot_registry_url?: string;
                ssot_registry_sha256?: string;
                ssot_schema_version?: string;
                ssot_summary?: string;
                ssot_observed_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryListResponse"];
                };
            };
        };
    };
    "Repository.read": {
        parameters: {
            query?: {
                id?: string;
                provider?: string;
                owner?: string;
                name?: string;
                url?: string;
                description?: string;
                default_branch?: string;
                is_archived?: boolean;
                is_fork?: boolean;
                license_expression?: string;
                ssot_governed?: boolean;
                ssot_registry_url?: string;
                ssot_registry_sha256?: string;
                ssot_schema_version?: string;
                ssot_summary?: string;
                ssot_observed_at?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositoryReadResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.list": {
        parameters: {
            query?: {
                id?: string;
                registry_url?: string;
                schema_version?: string;
                source_sha256?: string;
                valid?: boolean;
                observed_at?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotRegistryListResponse"];
                };
            };
        };
    };
    "RepositorySsotRegistry.read": {
        parameters: {
            query?: {
                id?: string;
                registry_url?: string;
                schema_version?: string;
                source_sha256?: string;
                valid?: boolean;
                observed_at?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepositorySsotRegistryReadResponse"];
                };
            };
        };
    };
    "RuntimeApi.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeApiListResponse"];
                };
            };
        };
    };
    "RuntimeApi.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeApiReadResponse"];
                };
            };
        };
    };
    "RuntimeDeployment.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeDeploymentListResponse"];
                };
            };
        };
    };
    "RuntimeDeployment.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeDeploymentReadResponse"];
                };
            };
        };
    };
    "RuntimeDeploymentTarget.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeDeploymentTargetListResponse"];
                };
            };
        };
    };
    "RuntimeDeploymentTarget.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeDeploymentTargetReadResponse"];
                };
            };
        };
    };
    "RuntimeEndpoint.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeEndpointListResponse"];
                };
            };
        };
    };
    "RuntimeEndpoint.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeEndpointReadResponse"];
                };
            };
        };
    };
    "RuntimeEnvironment.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeEnvironmentListResponse"];
                };
            };
        };
    };
    "RuntimeEnvironment.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeEnvironmentReadResponse"];
                };
            };
        };
    };
    "RuntimeGateway.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeGatewayListResponse"];
                };
            };
        };
    };
    "RuntimeGateway.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeGatewayReadResponse"];
                };
            };
        };
    };
    "RuntimeScheduledJob.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeScheduledJobListResponse"];
                };
            };
        };
    };
    "RuntimeScheduledJob.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeScheduledJobReadResponse"];
                };
            };
        };
    };
    "RuntimeService.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeServiceListResponse"];
                };
            };
        };
    };
    "RuntimeService.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeServiceReadResponse"];
                };
            };
        };
    };
    "RuntimeWebhook.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeWebhookListResponse"];
                };
            };
        };
    };
    "RuntimeWebhook.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeWebhookReadResponse"];
                };
            };
        };
    };
    "RuntimeWorker.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeWorkerListResponse"];
                };
            };
        };
    };
    "RuntimeWorker.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeWorkerReadResponse"];
                };
            };
        };
    };
    "SourceBranch.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceBranchListResponse"];
                };
            };
        };
    };
    "SourceBranch.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceBranchReadResponse"];
                };
            };
        };
    };
    "SourceCommit.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceCommitListResponse"];
                };
            };
        };
    };
    "SourceCommit.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceCommitReadResponse"];
                };
            };
        };
    };
    "SourceTag.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceTagListResponse"];
                };
            };
        };
    };
    "SourceTag.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceTagReadResponse"];
                };
            };
        };
    };
    "SourceWorkspace.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceWorkspaceListResponse"];
                };
            };
        };
    };
    "SourceWorkspace.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceWorkspaceReadResponse"];
                };
            };
        };
    };
    "TaxonomyAudience.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyAudienceListResponse"];
                };
            };
        };
    };
    "TaxonomyAudience.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyAudienceReadResponse"];
                };
            };
        };
    };
    "TaxonomyCapability.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyCapabilityListResponse"];
                };
            };
        };
    };
    "TaxonomyCapability.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyCapabilityReadResponse"];
                };
            };
        };
    };
    "TaxonomyCategory.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyCategoryListResponse"];
                };
            };
        };
    };
    "TaxonomyCategory.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyCategoryReadResponse"];
                };
            };
        };
    };
    "TaxonomyDomain.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyDomainListResponse"];
                };
            };
        };
    };
    "TaxonomyDomain.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyDomainReadResponse"];
                };
            };
        };
    };
    "TaxonomyEcosystem.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyEcosystemListResponse"];
                };
            };
        };
    };
    "TaxonomyEcosystem.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyEcosystemReadResponse"];
                };
            };
        };
    };
    "TaxonomyLanguage.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyLanguageListResponse"];
                };
            };
        };
    };
    "TaxonomyLanguage.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyLanguageReadResponse"];
                };
            };
        };
    };
    "TaxonomyTopic.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyTopicListResponse"];
                };
            };
        };
    };
    "TaxonomyTopic.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaxonomyTopicReadResponse"];
                };
            };
        };
    };
    "Technology.list": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                category?: string;
                description?: string;
                icon_key?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TechnologyListResponse"];
                };
            };
        };
    };
    "Technology.read": {
        parameters: {
            query?: {
                id?: string;
                slug?: string;
                name?: string;
                category?: string;
                description?: string;
                icon_key?: string;
                website_url?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TechnologyReadResponse"];
                };
            };
        };
    };
    "WorkDiscussion.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkDiscussionListResponse"];
                };
            };
        };
    };
    "WorkDiscussion.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkDiscussionReadResponse"];
                };
            };
        };
    };
    "WorkIssue.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkIssueListResponse"];
                };
            };
        };
    };
    "WorkIssue.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkIssueReadResponse"];
                };
            };
        };
    };
    "WorkMilestone.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkMilestoneListResponse"];
                };
            };
        };
    };
    "WorkMilestone.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkMilestoneReadResponse"];
                };
            };
        };
    };
    "WorkProject.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkProjectListResponse"];
                };
            };
        };
    };
    "WorkProject.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkProjectReadResponse"];
                };
            };
        };
    };
    "WorkPullRequest.list": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkPullRequestListResponse"];
                };
            };
        };
    };
    "WorkPullRequest.read": {
        parameters: {
            query?: {
                id?: string;
                name?: string;
                description?: string;
                source_url?: string;
                observed_at?: string;
                source_payload?: string;
            };
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkPullRequestReadResponse"];
                };
            };
        };
    };
}
