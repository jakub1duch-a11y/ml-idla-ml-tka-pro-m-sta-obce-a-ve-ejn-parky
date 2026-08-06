# Architecture Overview — Mlžidla & mlžítka

This document provides a high-level architecture overview for the "mistcoolingcitieswithmiststainlessdesignsculpture" project (Mlžidla & mlžítka pro města, obce a veřejné parky).

```mermaid
flowchart LR
  %% Frontend
  Browser["User Browser\n(Visitors / Mobile)"] -->|HTTPS| ViteApp[Vite Frontend\n(JS/TS SPA)]
  ViteApp -->|Base44 SDK| Base44Client[src/api/base44Client.js]
  Base44Client -->|REST / RPC| API[API Gateway / Base44 Backend]

  %% Backend services
  subgraph Backend
    direction TB
    API --> Functions[Serverless Functions / API Routes]
    Functions --> Auth[Auth Service]
    Functions --> RulesEngine[Rules & Scheduling Engine]
    Functions --> DeviceController[Device Controller Service]
    DeviceController -->|MQTT / WebSocket| Broker[Message Broker (MQTT)]
    Broker -->|Telemetry / Commands| MistDevice[Mist Emitters / Sculptures (IoT)]
    MistDevice -->|Sensor Data| Broker
  end

  %% Data stores
  Functions -->|Reads/Writes| Postgres[(Postgres / Relational DB)]
  Functions -->|Writes| BlobStorage[(Object Storage \n(images, firmware)]

  %% Admin & Operators
  AdminPanel["Admin Panel / Dashboard"] -->|HTTPS| ViteApp
  AdminPanel -->|API| API
  Operators["Operators / Field App"] -->|MQTT or Mobile| DeviceController

  %% CI/CD & Hosting
  GitHubActions["CI / CD (GitHub Actions)"] -->|Build & Deploy| Hosting["Hosting (Edge CDN / Base44)\nFrontend + Backend"]

  %% Monitoring
  Monitoring["Monitoring & Logs\n(Prometheus, Grafana, Sentry)"] --> Functions
  Monitoring --> DeviceController
  Monitoring --> Broker

  %% External Integrations
  WeatherAPI["External Weather / Env API"] --> RulesEngine
  PaymentGateway["Payment / Billing"] -.-> Functions

  %% Styling/Design note
  subgraph Art
    direction LR
    Sculpture["Stainless Mist Sculpture\n(design element)"]
    Sculpture -->|Connected| MistDevice
  end

  %% Legend
  classDef infra fill:#f8f9fa,stroke:#333,stroke-width:1px;
  class Hosting,Postgres,Broker,BlobStorage,GitHubActions,Monitoring infra;

  %% Notes
  noteRight of MistDevice
    Mist devices run lightweight firmware,
    connect via MQTT (TLS), report telemetry,
    accept scheduled commands from the
    Device Controller Service.
  end

``` 

Notes
- Keep frontend SDK client (src/api/base44Client.js) as the single point of integration with the Base44 backend.
- Device communication should use secure MQTT over TLS and token-based authentication.
- Use a relational DB for configuration, schedules, and user data; use object storage for images and firmware.
- Monitor telemetry and device health; surface alerts in the Admin Panel.

