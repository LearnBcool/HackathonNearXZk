// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Interface para o contrato FreteRacer
interface IFreteRacer {
    enum ServiceStatus {
        Available,
        InProgress,
        InTransit,
        Completed,
        Cancelled
    }

    function getService(uint256 _serviceId) external view returns (
        uint256 id,
        address client,
        address transporter,
        string memory origin,
        string memory destination,
        string memory cargoType,
        uint256 weight,
        uint256 volume,
        uint256 pickupDate,
        ServiceStatus status,
        uint256 acceptedBidAmount
    );

    function updateServiceStatus(uint256 _serviceId, ServiceStatus _status) external;
}

contract SolicitanteContract {
    // Enum para o status do serviço no contrato do solicitante
    enum ServiceStatus {
        NotRequested,
        Requested,
        Accepted,
        Completed,
        Cancelled
    }

    // Referência ao contrato FreteRacer
    IFreteRacer public freteRacerContract;

    // Mapeamento de status de serviços
    mapping(uint256 => ServiceStatus) public serviceStatuses;

    // Eventos
    event ServiceRequested(uint256 indexed serviceId, address indexed client);
    event ServiceAccepted(uint256 indexed serviceId, address indexed client, address indexed transporter);

    // Construtor
    constructor(address _freteRacerAddress) {
        freteRacerContract = IFreteRacer(_freteRacerAddress);
    }

    // Função para solicitar um serviço
    function requestService(uint256 _serviceId) external {
        // Obter informações do serviço do contrato FreteRacer
        (uint256 id, address client, , , , , , , , IFreteRacer.ServiceStatus status, ) = freteRacerContract.getService(_serviceId);

        // Verificar se o serviço existe e está disponível
        require(id == _serviceId, "Service does not exist");
        require(status == IFreteRacer.ServiceStatus.Available, "Service is not available");
        
        // Verificar se o chamador é o cliente do serviço
        require(client == msg.sender, "Only the client can request this service");
        
        // Verificar se o serviço ainda não foi solicitado
        require(serviceStatuses[_serviceId] == ServiceStatus.NotRequested, "Service already requested");
        
        // Atualizar o status do serviço
        serviceStatuses[_serviceId] = ServiceStatus.Requested;
        
        // Emitir evento
        emit ServiceRequested(_serviceId, msg.sender);
    }

    // Função para aceitar um serviço (pelo transportador)
    function acceptService(uint256 _serviceId, address _transporter) external {
        // Verificar se o serviço foi solicitado
        require(serviceStatuses[_serviceId] == ServiceStatus.Requested, "Service not requested");
        
        // Obter informações do serviço do contrato FreteRacer
        (uint256 id, address client, , , , , , , , IFreteRacer.ServiceStatus status, ) = freteRacerContract.getService(_serviceId);
        
        // Verificar se o serviço existe e está em progresso
        require(id == _serviceId, "Service does not exist");
        require(status == IFreteRacer.ServiceStatus.InProgress, "Service is not in progress");
        
        // Verificar se o chamador é o transportador
        require(_transporter == msg.sender, "Only the assigned transporter can accept this service");
        
        // Atualizar o status do serviço
        serviceStatuses[_serviceId] = ServiceStatus.Accepted;
        
        // Atualizar o status no contrato FreteRacer para "Em Trânsito"
        freteRacerContract.updateServiceStatus(_serviceId, IFreteRacer.ServiceStatus.InTransit);
        
        // Emitir evento
        emit ServiceAccepted(_serviceId, client, msg.sender);
    }

    // Função para obter o status de um serviço
    function getServiceStatus(uint256 _serviceId) external view returns (ServiceStatus) {
        return serviceStatuses[_serviceId];
    }

    // Função para marcar um serviço como concluído
    function completeService(uint256 _serviceId) external {
        // Verificar se o serviço foi aceito
        require(serviceStatuses[_serviceId] == ServiceStatus.Accepted, "Service not accepted");
        
        // Obter informações do serviço do contrato FreteRacer
        (uint256 id, address client, address transporter, , , , , , , IFreteRacer.ServiceStatus status, ) = freteRacerContract.getService(_serviceId);
        
        // Verificar se o serviço existe e está em trânsito
        require(id == _serviceId, "Service does not exist");
        require(status == IFreteRacer.ServiceStatus.InTransit, "Service is not in transit");
        
        // Verificar se o chamador é o cliente ou o transportador
        require(msg.sender == client || msg.sender == transporter, "Only client or transporter can complete this service");
        
        // Atualizar o status do serviço
        serviceStatuses[_serviceId] = ServiceStatus.Completed;
        
        // Atualizar o status no contrato FreteRacer para "Concluído"
        freteRacerContract.updateServiceStatus(_serviceId, IFreteRacer.ServiceStatus.Completed);
    }

    // Função para cancelar um serviço
    function cancelService(uint256 _serviceId) external {
        // Verificar se o serviço foi solicitado ou aceito
        require(
            serviceStatuses[_serviceId] == ServiceStatus.Requested || 
            serviceStatuses[_serviceId] == ServiceStatus.Accepted,
            "Service not in a cancellable state"
        );
        
        // Obter informações do serviço do contrato FreteRacer
        (uint256 id, address client, address transporter, , , , , , , , ) = freteRacerContract.getService(_serviceId);
        
        // Verificar se o serviço existe
        require(id == _serviceId, "Service does not exist");
        
        // Verificar se o chamador é o cliente ou o transportador
        require(msg.sender == client || msg.sender == transporter, "Only client or transporter can cancel this service");
        
        // Atualizar o status do serviço
        serviceStatuses[_serviceId] = ServiceStatus.Cancelled;
        
        // Atualizar o status no contrato FreteRacer para "Cancelado"
        freteRacerContract.updateServiceStatus(_serviceId, IFreteRacer.ServiceStatus.Cancelled);
    }
}
