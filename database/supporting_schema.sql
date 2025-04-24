-- Tasks and to-dos
CREATE TABLE tasks (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to_id CHAR(36) NOT NULL,
    assigned_by_id CHAR(36) NOT NULL,
    patient_id CHAR(36),
    related_entity_type VARCHAR(100), -- appointment, message, lab_result, etc.
    related_entity_id VARCHAR(36),
    due_date DATETIME,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    category ENUM('administrative', 'clinical', 'personal', 'followup', 'other') DEFAULT 'administrative',
    completed_at DATETIME,
    completed_by_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by_id) REFERENCES users(id),
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE SET NULL,
    FOREIGN KEY (completed_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_task_assigned_to (assigned_to_id),
    INDEX idx_task_patient (patient_id),
    INDEX idx_task_status (status),
    INDEX idx_task_due_date (due_date),
    INDEX idx_task_related (related_entity_type, related_entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Device tokens for push notifications
CREATE TABLE device_tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    device_type ENUM('ios', 'android', 'web') NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    device_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_device_token (user_id, device_token),
    INDEX idx_device_user (user_id),
    INDEX idx_device_token (device_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System settings and configuration
CREATE TABLE system_settings (
    id CHAR(36) PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_group VARCHAR(100) NOT NULL,
    description TEXT,
    data_type ENUM('string', 'integer', 'boolean', 'json', 'datetime') NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_by_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_setting_key (setting_key),
    INDEX idx_setting_group (setting_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Family relationships
CREATE TABLE family_relationships (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    related_patient_id CHAR(36) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- parent, child, spouse, sibling, etc.
    is_emergency_contact BOOLEAN DEFAULT FALSE,
    has_proxy_access BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (related_patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_relationship (patient_id, related_patient_id),
    INDEX idx_relationship_patient (patient_id),
    INDEX idx_relationship_related (related_patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feature flags
CREATE TABLE feature_flags (
    id CHAR(36) PRIMARY KEY,
    feature_key VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    user_role VARCHAR(50), -- If null, applies to all users
    percentage_rollout INT DEFAULT 100, -- 0-100 for gradual rollout
    start_date DATETIME,
    end_date DATETIME,
    created_by_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_feature_key_role (feature_key, user_role),
    INDEX idx_feature_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
