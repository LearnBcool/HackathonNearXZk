// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FreteRacer {
    // Enumeração para o status do serviço
    enum ServiceStatus {
        Available,      // Disponível para lances
        InProgress,     // Em andamento (lance aceito)
        InTransit,      // Em trânsito
        Completed,      // Concluído
        Cancelled       // Cancelado
    }

    // Estrutura para armazenar informações do serviço
    struct Service {
        uint256 id;
        address client;
        address transporter;
        string origin;
        string destination;
        string cargoType;
        uint256 weight;
        uint256 volume;
        uint256 pickupDate;
        ServiceStatus status;
        uint256 acceptedBidAmount;
    }

    // Estrutura para armazenar informações do lance
    struct Bid {
        address bidder;
        uint256 amount;
        bool accepted;
    }

    // Contador de serviços
    uint256 private serviceCounter;

    // Mapeamento de serviços por ID
    mapping(uint256 => Service) private services;
    
    // Mapeamento de lances por serviço
    mapping(uint256 => Bid[]) private bids;
    
    // Mapeamento de usuários verificados
    mapping(address => bool) private verifiedUsers;

    // Eventos
    event ServiceCreated(uint256 indexed serviceId, address indexed client);
    event BidPlaced(uint256 indexed serviceId, address indexed bidder, uint256 amount);
    event BidAccepted(uint256 indexed serviceId, address indexed bidder);
    event ServiceStatusChanged(uint256 indexed serviceId, ServiceStatus status);

    // Construtor
    constructor() {
        serviceCounter = 0;
    }

    // Modificador para verificar se o usuário está verificado
    modifier onlyVerified() {
        require(verifiedUsers[msg.sender], "User not verified");
        _;
    }

    // Modificador para verificar se o usuário é o cliente do serviço
    modifier onlyClient(uint256 _serviceId) {
        require(services[_serviceId].client == msg.sender, "Only the client can perform this action");
        _;
    }

    // Modificador para verificar se o usuário é o transportador do serviço
    modifier onlyTransporter(uint256 _serviceId) {
        require(services[_serviceId].transporter == msg.sender, "Only the transporter can perform this action");
        _;
    }

    // Função para verificar um usuário (simulação de ZK Proof)
    function verifyUser(address _user) external {
        // Na implementação real, isso seria feito através de um sistema de ZK Proof
        // Por enquanto, apenas marcamos o usuário como verificado
        verifiedUsers[_user] = true;
    }

    // Função para criar um novo serviço
    function createService(
        string memory _origin,
        string memory _destination,
        string memory _cargoType,
        uint256 _weight,
        uint256 _volume,
        uint256 _pickupDate
    ) external onlyVerified returns (uint256) {
        uint256 serviceId = serviceCounter++;
        
        services[serviceId] = Service({
            id: serviceId,
            client: msg.sender,
            transporter: address(0),
            origin: _origin,
            destination: _destination,
            cargoType: _cargoType,
            weight: _weight,
            volume: _volume,
            pickupDate: _pickupDate,
            status: ServiceStatus.Available,
            acceptedBidAmount: 0
        });
        
        emit ServiceCreated(serviceId, msg.sender);
        
        return serviceId;
    }

    // Função para fazer um lance em um serviço
    function placeBid(uint256 _serviceId, uint256 _amount) external onlyVerified {
        require(services[_serviceId].status == ServiceStatus.Available, "Service not available for bidding");
        require(services[_serviceId].client != msg.sender, "Client cannot bid on own service");
        
        bids[_serviceId].push(Bid({
            bidder: msg.sender,
            amount: _amount,
            accepted: false
        }));
        
        emit BidPlaced(_serviceId, msg.sender, _amount);
    }

    // Função para aceitar um lance
    function acceptBid(uint256 _serviceId, address _bidder) external onlyClient(_serviceId) {
        require(services[_serviceId].status == ServiceStatus.Available, "Service not available for accepting bids");
        
        bool bidFound = false;
        uint256 bidAmount = 0;
        
        for (uint256 i = 0; i < bids[_serviceId].length; i++) {
            if (bids[_serviceId][i].bidder == _bidder) {
                bids[_serviceId][i].accepted = true;
                bidFound = true;
                bidAmount = bids[_serviceId][i].amount;
                break;
            }
        }
        
        require(bidFound, "Bid not found");
        
        services[_serviceId].transporter = _bidder;
        services[_serviceId].status = ServiceStatus.InProgress;
        services[_serviceId].acceptedBidAmount = bidAmount;
        
        emit BidAccepted(_serviceId, _bidder);
        emit ServiceStatusChanged(_serviceId, ServiceStatus.InProgress);
    }

    // Função para atualizar o status de um serviço
    function updateServiceStatus(uint256 _serviceId, ServiceStatus _status) external {
        require(
            msg.sender == services[_serviceId].client || 
            msg.sender == services[_serviceId].transporter,
            "Only client or transporter can update status"
        );
        
        // Verificações específicas para cada transição de status
        if (_status == ServiceStatus.InTransit) {
            require(
                services[_serviceId].status == ServiceStatus.InProgress,
                "Service must be in progress to transit"
            );
            require(
                msg.sender == services[_serviceId].transporter,
                "Only transporter can set to in transit"
            );
        } else if (_status == ServiceStatus.Completed) {
            require(
                services[_serviceId].status == ServiceStatus.InTransit,
                "Service must be in transit to complete"
            );
            require(
                msg.sender == services[_serviceId].client,
                "Only client can set to completed"
            );
        } else if (_status == ServiceStatus.Cancelled) {
            require(
                services[_serviceId].status == ServiceStatus.Available || 
                services[_serviceId].status == ServiceStatus.InProgress,
                "Cannot cancel service in transit or completed"
            );
        }
        
        services[_serviceId].status = _status;
        emit ServiceStatusChanged(_serviceId, _status);
    }

    // Função para obter informações de um serviço
    function getService(uint256 _serviceId) external view returns (Service memory) {
        return services[_serviceId];
    }

    // Função para obter o número total de serviços
    function getServicesCount() external view returns (uint256) {
        return serviceCounter;
    }

    // Função para obter todos os lances de um serviço
    function getBids(uint256 _serviceId) external view returns (Bid[] memory) {
        return bids[_serviceId];
    }

    // Função para verificar se um usuário está verificado
    function isUserVerified(address _user) external view returns (bool) {
        return verifiedUsers[_user];
    }
}
