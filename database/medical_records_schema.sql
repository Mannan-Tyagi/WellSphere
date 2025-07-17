-- Patient conditions (diagnoses)
CREATE TABLE patient_conditions (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    icd_10_code VARCHAR(20),
    diagnosed_date DATE,
    diagnosed_by_id CHAR(36),
    status ENUM('active', 'resolved', 'recurring', 'in_remission') NOT NULL DEFAULT 'active',
    resolved_date DATE,
    notes TEXT,
    is_chronic BOOLEAN DEFAULT FALSE,
    severity ENUM('mild', 'moderate', 'severe') DEFAULT 'moderate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (diagnosed_by_id) REFERENCES doctor_profiles(id) ON DELETE SET NULL,
    INDEX idx_condition_patient (patient_id),
    INDEX idx_condition_status (status),
    INDEX idx_condition_code (icd_10_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Patient medications
CREATE TABLE patient_medications (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    prescribed_by_id CHAR(36),
    prescribed_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    route VARCHAR(50) NOT NULL, -- oral, injected, etc.
    reason VARCHAR(255),
    instruction TEXT,
    status ENUM('active', 'discontinued', 'completed') NOT NULL DEFAULT 'active',
    pharmacy_notes TEXT,
    refills_authorized INT DEFAULT 0,
    refills_remaining INT DEFAULT 0,
    is_controlled_substance BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (prescribed_by_id) REFERENCES doctor_profiles(id) ON DELETE SET NULL,
    INDEX idx_medication_patient (patient_id),
    INDEX idx_medication_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medication refill requests
CREATE TABLE medication_refill_requests (
    id CHAR(36) PRIMARY KEY,
    medication_id CHAR(36) NOT NULL,
    requested_by_id CHAR(36) NOT NULL,
    requested_date DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'denied', 'completed') NOT NULL DEFAULT 'pending',
    response_by_id CHAR(36),
    response_date DATETIME,
    notes TEXT,
    pharmacy_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES patient_medications(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by_id) REFERENCES users(id),
    FOREIGN KEY (response_by_id) REFERENCES users(id),
    INDEX idx_refill_medication (medication_id),
    INDEX idx_refill_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vital signs records
CREATE TABLE vital_signs (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    appointment_id CHAR(36),
    recorded_by_id CHAR(36) NOT NULL,
    recorded_at DATETIME NOT NULL,
    temperature DECIMAL(4,1), -- in Celsius
    heart_rate INT, -- bpm
    respiratory_rate INT, -- breaths per minute
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    oxygen_saturation DECIMAL(4,1), -- percentage
    pain_level TINYINT, -- 0-10 scale
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    bmi DECIMAL(4,1),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by_id) REFERENCES users(id),
    INDEX idx_vitals_patient (patient_id),
    INDEX idx_vitals_appointment (appointment_id),
    INDEX idx_vitals_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lab test results
CREATE TABLE lab_results (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    ordered_by_id CHAR(36) NOT NULL,
    reviewed_by_id CHAR(36),
    order_date DATETIME NOT NULL,
    result_date DATETIME,
    lab_name VARCHAR(255),
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(50),
    test_category VARCHAR(100),
    result_value TEXT,
    reference_range TEXT,
    unit VARCHAR(50),
    abnormal_flag ENUM('normal', 'low', 'high', 'abnormal', 'critical'),
    status ENUM('ordered', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'ordered',
    notes TEXT,
    is_public_to_patient BOOLEAN DEFAULT FALSE,
    viewed_by_patient BOOLEAN DEFAULT FALSE,
    viewed_by_patient_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (ordered_by_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by_id) REFERENCES users(id),
    INDEX idx_lab_patient (patient_id),
    INDEX idx_lab_status (status),
    INDEX idx_lab_test (test_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Medical documents/files
CREATE TABLE medical_documents (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    uploaded_by_id CHAR(36) NOT NULL,
    appointment_id CHAR(36),
    document_type ENUM('lab_result', 'imaging', 'clinical_note', 'referral', 'prescription', 'consent_form', 'discharge_summary', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INT, -- in bytes
    storage_provider ENUM('local', 's3', 'azure', 'gcp') DEFAULT 'local',
    is_encrypted BOOLEAN DEFAULT TRUE,
    ocr_processed BOOLEAN DEFAULT FALSE,
    ocr_text TEXT,
    is_public_to_patient BOOLEAN DEFAULT FALSE,
    viewed_by_patient BOOLEAN DEFAULT FALSE,
    viewed_by_patient_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_id) REFERENCES users(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_document_patient (patient_id),
    INDEX idx_document_type (document_type),
    INDEX idx_document_appointment (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Visit/Encounter notes
CREATE TABLE clinical_encounters (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    doctor_id CHAR(36) NOT NULL,
    appointment_id CHAR(36),
    encounter_date DATETIME NOT NULL,
    encounter_type ENUM('office_visit', 'telemedicine', 'phone_consultation', 'hospital_admission', 'emergency', 'follow_up') NOT NULL,
    chief_complaint TEXT,
    subjective TEXT, -- patient's description
    objective TEXT, -- clinician's observations
    assessment TEXT, -- diagnosis and interpretation
    plan TEXT, -- treatment plan
    diagnoses JSON, -- array of condition IDs or ICD-10 codes
    billing_code VARCHAR(50), -- E/M code
    billing_level VARCHAR(20),
    is_finalized BOOLEAN DEFAULT FALSE,
    finalized_at DATETIME,
    finalized_by_id CHAR(36),
    is_public_to_patient BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (finalized_by_id) REFERENCES users(id),
    INDEX idx_encounter_patient (patient_id),
    INDEX idx_encounter_doctor (doctor_id),
    INDEX idx_encounter_date (encounter_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clinical encounter versions (for audit and history)
CREATE TABLE clinical_encounter_versions (
    id CHAR(36) PRIMARY KEY,
    encounter_id CHAR(36) NOT NULL,
    version_number INT NOT NULL,
    modified_by_id CHAR(36) NOT NULL,
    modified_at DATETIME NOT NULL,
    content_json JSON NOT NULL, -- full JSON snapshot of the encounter
    change_reason VARCHAR(255),
    FOREIGN KEY (encounter_id) REFERENCES clinical_encounters(id) ON DELETE CASCADE,
    FOREIGN KEY (modified_by_id) REFERENCES users(id),
    INDEX idx_version_encounter (encounter_id),
    UNIQUE KEY uk_encounter_version (encounter_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
