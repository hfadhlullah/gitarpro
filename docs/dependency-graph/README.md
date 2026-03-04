# Global Dependency Graph

This document tracks the execution order of all features across the GitarPro project.

## Current Build Order

```mermaid
graph TD
    %% Nodes
    A["GTPR-001: Init Laravel Inertia (L1)"]:::pending
    B["GTPR-002: Docker Minio/Postgres (L1)"]:::pending
    C["GTPR-003: Postgres Migrations/Auth (L1)"]:::pending
    D["GTPR-004: React Shadcn Theme (L2)"]:::pending
    E["GTPR-005: Reverb WebSockets (L3)"]:::pending
    F["GTPR-006: S3 Minio Facade (L3)"]:::pending
    G["GTPR-007: Integration Smoke Test (L5)"]:::pending

    %% Dependencies
    A --> C
    B --> C
    
    A --> D
    
    A --> E
    
    A --> F
    B --> F
    
    C --> G
    D --> G
    E --> G
    F --> G

    %% Styles
    classDef done fill:#d4f0f0,stroke:#007777,stroke-width:2px;
    classDef pending fill:#fff,stroke:#ccc,stroke-width:1px;
    classDef external fill:#eee,stroke:#999,stroke-dasharray: 5 5;
```

## Ready to Start
The following stories have no pending dependencies and block downstream work. They should be picked up immediately:
*   [ ] **GTPR-001**: Init Laravel Inertia
*   [ ] **GTPR-002**: Docker Minio/Postgres
