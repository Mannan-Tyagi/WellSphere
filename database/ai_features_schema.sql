-- No-show prediction model data
CREATE TABLE noshow_predictions (
    id CHAR(36) PRIMARY KEY,
    appointment_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    prediction_score DECIMAL(5,4) NOT NULL, -- 0 to 1 probability
    risk_level ENUM('low', 'medium', 'high', 'very_high') NOT NULL,
    contributing_factors JSON, -- array of factors that contributed to prediction
    model_version VARCHAR(50) NOT NULL,
    prediction_timestamp DATETIME NOT NULL,
    prediction_accuracy DECIMAL(5,4), -- filled in after appointment date
    actual_outcome ENUM('showed', 'no_show', 'cancelled', 'rescheduled'), -- filled in after appointment date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    INDEX idx_prediction_appointment (appointment_id),
    INDEX idx_prediction_patient (patient_id),
    INDEX idx_prediction_risk (risk_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Scheduling optimization suggestions
CREATE TABLE scheduling_optimizations (
    id CHAR(36) PRIMARY KEY,
    doctor_id CHAR(36) NOT NULL,
    optimization_type ENUM('slot_recommendation', 'conflict_resolution', 'batch_scheduling', 'capacity_planning') NOT NULL,
    suggestion TEXT NOT NULL,
    suggestion_reason TEXT,
    affected_date DATE,
    affected_time_start TIME,
    affected_time_end TIME,
    efficiency_improvement DECIMAL(5,2), -- percentage
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'accepted', 'rejected', 'implemented') DEFAULT 'pending',
    applied_by_id CHAR(36),
    applied_at DATETIME,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (applied_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_optimization_doctor (doctor_id),
    INDEX idx_optimization_status (status),
    INDEX idx_optimization_date (affected_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clinical decision support
CREATE TABLE clinical_decision_support (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    encounter_id CHAR(36),
    provider_id CHAR(36) NOT NULL,
    suggestion_type ENUM('diagnosis', 'medication', 'lab_test', 'treatment', 'referral', 'follow_up') NOT NULL,
    suggestion TEXT NOT NULL,
    justification TEXT,
    evidence_level ENUM('high', 'moderate', 'low') NOT NULL,
    reference_links JSON, -- array of reference URLs
    model_version VARCHAR(50) NOT NULL,
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    reviewed_by_id CHAR(36),
    reviewed_at DATETIME,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (encounter_id) REFERENCES clinical_encounters(id) ON DELETE SET NULL,
    FOREIGN KEY (provider_id) REFERENCES doctor_profiles(id),
    FOREIGN KEY (reviewed_by_id) REFERENCES users(id),
    INDEX idx_cds_patient (patient_id),
    INDEX idx_cds_encounter (encounter_id),
    INDEX idx_cds_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documentation assistance
CREATE TABLE documentation_templates (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100),
    template_type ENUM('soap', 'procedure', 'referral', 'discharge', 'custom') NOT NULL,
    template_content TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_by_id CHAR(36) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    INDEX idx_template_specialty (specialty),
    INDEX idx_template_type (template_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI-generated documentation
CREATE TABLE ai_generated_documents (
    id CHAR(36) PRIMARY KEY,
    encounter_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    document_type ENUM('soap', 'procedure_note', 'discharge_summary', 'referral', 'custom') NOT NULL,
    source_content TEXT, -- original input
    generated_content TEXT NOT NULL, -- AI output
    is_edited BOOLEAN DEFAULT FALSE,
    edited_content TEXT, -- provider edited version
    edited_by_id CHAR(36),
    edited_at DATETIME,
    model_version VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (encounter_id) REFERENCES clinical_encounters(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (provider_id) REFERENCES doctor_profiles(id),
    FOREIGN KEY (edited_by_id) REFERENCES users(id),
    INDEX idx_ai_doc_encounter (encounter_id),
    INDEX idx_ai_doc_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Voice transcription data
CREATE TABLE voice_transcriptions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    encounter_id CHAR(36),
    audio_file_path VARCHAR(255),
    audio_duration INT, -- in seconds
    transcription_text TEXT NOT NULL,
    confidence_score DECIMAL(5,4),
    is_reviewed BOOLEAN DEFAULT FALSE,
    reviewed_by_id CHAR(36),
    reviewed_at DATETIME,
    corrections TEXT,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (encounter_id) REFERENCES clinical_encounters(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by_id) REFERENCES users(id),
    INDEX idx_transcription_user (user_id),
    INDEX idx_transcription_encounter (encounter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
