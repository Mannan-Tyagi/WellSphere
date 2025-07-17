-- Audit log for data access and changes
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    action ENUM('view', 'create', 'update', 'delete', 'export', 'print', 'share', 'login', 'logout', 'failed_login') NOT NULL,
    resource_type VARCHAR(100) NOT NULL, -- patient, appointment, message, etc.
    resource_id VARCHAR(36),
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME NOT NULL,
    additional_data JSON,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_resource (resource_type, resource_id),
    INDEX idx_audit_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- PHI access logs
CREATE TABLE phi_access_logs (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    access_type ENUM('direct_care', 'administrative', 'billing', 'research', 'emergency', 'other') NOT NULL,
    access_reason TEXT NOT NULL,
    data_accessed JSON, -- array of data categories accessed
    timestamp DATETIME NOT NULL,
    ip_address VARCHAR(45),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    INDEX idx_phi_user (user_id),
    INDEX idx_phi_patient (patient_id),
    INDEX idx_phi_timestamp (timestamp),
    INDEX idx_phi_access_type (access_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient data consent records
CREATE TABLE patient_consents (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    consent_type ENUM('treatment', 'telehealth', 'research', 'data_sharing', 'marketing', 'hipaa') NOT NULL,
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    consented_at DATETIME NOT NULL,
    expires_at DATETIME,
    document_id CHAR(36), -- reference to signed consent form
    witness_id CHAR(36),
    revoked_at DATETIME,
    revoked_reason TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES medical_documents(id) ON DELETE SET NULL,
    FOREIGN KEY (witness_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_consent_patient (patient_id),
    INDEX idx_consent_type (consent_type),
    INDEX idx_consent_status (granted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data encryption keys
CREATE TABLE encryption_keys (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    entity_type VARCHAR(100) NOT NULL, -- user, conversation, document, etc.
    entity_id VARCHAR(36) NOT NULL,
    key_type ENUM('symmetric', 'public', 'private') NOT NULL,
    key_identifier VARCHAR(255) NOT NULL,
    encrypted_key TEXT NOT NULL, -- encrypted with master key
    iv VARCHAR(255), -- initialization vector
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    revoked_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_entity_key (entity_type, entity_id, key_type),
    INDEX idx_key_user (user_id),
    INDEX idx_key_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Security events
CREATE TABLE security_events (
    id CHAR(36) PRIMARY KEY,
    event_type ENUM('login_failure', 'brute_force_attempt', 'suspicious_access', 'data_export', 'permission_change', 'password_reset', 'api_key_generated', 'mfa_change') NOT NULL,
    user_id CHAR(36),
    target_user_id CHAR(36),
    severity ENUM('info', 'low', 'medium', 'high', 'critical') NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    location VARCHAR(255),
    timestamp DATETIME NOT NULL,
    additional_data JSON,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by_id CHAR(36),
    resolved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (resolved_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_security_type (event_type),
    INDEX idx_security_user (user_id),
    INDEX idx_security_timestamp (timestamp),
    INDEX idx_security_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
