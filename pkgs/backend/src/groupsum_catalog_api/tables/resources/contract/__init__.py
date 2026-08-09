from .asyncapi import ContractAsyncapi
from .configuration_schema import ContractConfigurationSchema
from .data_schema import ContractDataSchema
from .event_schema import ContractEventSchema
from .graphql import ContractGraphql
from .json_schema import ContractJsonSchema
from .openapi import ContractOpenapi
from .openrpc import ContractOpenrpc
from .protobuf import ContractProtobuf
from .protocol_spec import ContractProtocolSpec

RESOURCE_TABLES = {
    "contract.asyncapi": ContractAsyncapi,
    "contract.configuration_schema": ContractConfigurationSchema,
    "contract.data_schema": ContractDataSchema,
    "contract.event_schema": ContractEventSchema,
    "contract.graphql": ContractGraphql,
    "contract.json_schema": ContractJsonSchema,
    "contract.openapi": ContractOpenapi,
    "contract.openrpc": ContractOpenrpc,
    "contract.protobuf": ContractProtobuf,
    "contract.protocol_spec": ContractProtocolSpec,
}

__all__ = ["RESOURCE_TABLES"]
