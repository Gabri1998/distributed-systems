# Distributed Dental Clinic Management System

A microservices-based distributed system for dental clinic management, developed as separate GitLab repositories with full CI/CD pipeline integration.

## System Architecture

This is a distributed system composed of multiple independent services, each maintained in its own GitLab repository with dedicated pipelines, testing, and deployment configurations. The system follows microservices architecture principles with clear service boundaries and communication protocols.

### Repository Structure
- **`api_gateway/`** - API Gateway (Central entry point)
- **`booking_service/`** - Appointment management service
- **`dentist_service/`** - Dentist and treatment management
- **`user_service/`** - User authentication and profiles
- **`notification_service/`** - Real-time notifications
- **`dentist-app/`** - Vue.js frontend for dental professionals
- **`user-app/`** - Vue.js frontend for patients
- **`notification test/vue-project/`** - Notification system frontend

## Technology Stack

### Backend Services (Node.js/Express.js)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful APIs
- **Testing**: Jest with JUnit reporting
- **Validation**: Schema-based request/response validation
- **Logging**: Structured logging with monitoring

### Frontend Applications (Vue.js)
- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite for fast development and building
- **UI Framework**: Vue Bootstrap for responsive components
- **State Management**: Vuex/Pinia for global state
- **Routing**: Vue Router for navigation
- **Real-time**: WebSocket integration

### Communication Protocols
- **RESTful APIs**: HTTP/HTTPS for synchronous communication
- **MQTT**: Message Queuing Telemetry Transport for real-time updates
- **WebSockets**: Bidirectional client-server communication
- **Vue Bootstrap Notifications**: Frontend notification system

## Service Architecture

### API Gateway
- Centralized request routing and load balancing
- Authentication and authorization middleware
- Request/response transformation
- Rate limiting and circuit breaking

### Core Services

#### Booking Service
- Appointment scheduling and management
- Availability checking and slot management
- Emergency appointment handling
- Calendar integration

#### Dentist Service
- Dental professional management
- Treatment plan creation and tracking
- Procedure and service catalog
- Work schedule management

#### User Service
- User registration and authentication
- Profile management
- Role-based access control
- Session management

#### Notification Service
- Real-time appointment reminders
- Treatment updates and alerts
- Vue Bootstrap notification integration
- In-app notification management

## Development Workflow

### Multi-Repository Strategy
Each service was developed as an independent GitLab repository with:
- Dedicated CI/CD pipelines (`.gitlab-ci.yml`)
- Independent versioning and releases
- Service-specific testing and quality gates
- Separate deployment configurations

### Continuous Integration/Deployment
- Automated testing on every commit
- Containerization with Docker
- Blue-green deployment strategies
- Environment-specific configurations
- Comprehensive test coverage reporting

## Key Features

### For Patients (User App)
- Online appointment booking and management
- Treatment history and progress tracking
- Secure messaging with dental professionals
- Digital payment processing
- Treatment plan visualization

### For Dental Professionals (Dentist App)
- Patient management dashboard
- Appointment calendar and scheduling
- Treatment documentation
- Real-time notifications using Vue Bootstrap
- Performance analytics

### Notification System
- Vue Bootstrap toast notifications
- Real-time appointment alerts
- Treatment status updates
- In-app notification center
- Notification preferences management

## Inter-Service Communication

### Synchronous Communication
- RESTful APIs for request/response patterns
- Standardized error handling and response formats
- API versioning and backward compatibility

### Asynchronous Communication
- MQTT for publish-subscribe messaging
- Event-driven architecture for system events
- Message queuing for decoupled services

### Real-time Updates
- WebSocket connections for live data
- Server-Sent Events for streaming updates
- Vue Bootstrap components for notification display

## Security Implementation

- JWT-based authentication
- Role-based authorization middleware
- Input validation and sanitization
- HTTPS/TLS encryption
- SQL injection prevention
- Cross-Site Request Forgery (CSRF) protection

## Testing Strategy

- Unit testing for business logic
- Integration testing for API endpoints
- End-to-end testing for user workflows
- Load testing for performance validation
- Security testing for vulnerability assessment

## Deployment Architecture

- Containerized services using Docker
- Orchestration with Kubernetes/Docker Swarm
- Service discovery and load balancing
- Horizontal scaling for high availability
- Database replication and sharding

## Development Practices

### Code Quality
- ESLint and Prettier for code formatting
- TypeScript for type safety
- Git hooks for pre-commit validation
- Code review processes
- Documentation standards

### Monitoring and Observability
- Structured logging with correlation IDs
- Performance metrics collection
- Error tracking and alerting
- Health check endpoints
- Distributed tracing

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- GitLab account for repository access
- MQTT broker (Mosquitto)

### Local Development
```bash
# Clone individual service repositories
git clone <gitlab-url>/api_gateway.git
git clone <gitlab-url>/booking_service.git
git clone <gitlab-url>/dentist_service.git
# ... clone all other services

# Install dependencies for each service
cd api_gateway && npm install
cd ../booking_service && npm install
# ... repeat for all services

# Run services individually
npm run dev

# Or use Docker Compose for full system
docker-compose up --build



Project Documentation

Each service repository contains:

    Service-specific README with setup instructions

    API documentation (OpenAPI/Swagger)

    Database schema definitions

    Environment configuration examples

    Testing guidelines

Team Collaboration

    GitLab Issues for feature tracking

    Merge Requests with code review requirements

    Milestone planning and sprint management

    Automated quality gates

    Performance benchmarking

    Note:
    As the primary architect and lead developer, I single-handedly designed and implemented the core backend system including the database schema,
    API gateway, and all microservices. Additionally, I made significant contributions to both frontend applications, the dentist interface and patient
    portal, nsuring seamless integration and optimal performance across the distributed system.

Academic Context

This distributed system was developed as part of a software engineering course focusing on:

    Microservices architecture patterns

    Distributed system design principles

    CI/CD pipeline implementation

    Team collaboration with multi-repository workflows

    Production-ready deployment strategies
