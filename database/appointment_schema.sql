-- Appointment types configuration
CREATE TABLE appointment_types (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    default_duration INT NOT NULL, -- in minutes
    color VARCHAR(20), -- for calendar display
    requires_approval BOOLEAN DEFAULT FALSE,
    virtual_allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_appointment_type_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments table
CREATE TABLE appointments (
    id CHAR(36) PRIMARY KEY,
    patient_id CHAR(36) NOT NULL,
    doctor_id CHAR(36) NOT NULL,
    appointment_type_id CHAR(36) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    status ENUM('pending', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'pending',
    cancellation_reason TEXT,
    cancelled_by CHAR(36), -- user ID who cancelled
    location_type ENUM('office', 'video', 'phone', 'home') NOT NULL,
    location_details VARCHAR(255), -- office number, video link, etc.
    purpose VARCHAR(255),
    preparation_instructions TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_interval INT, -- days until follow-up
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern_id CHAR(36), -- reference to recurring pattern
    created_by CHAR(36), -- user ID who created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id),
    FOREIGN KEY (appointment_type_id) REFERENCES appointment_types(id),
    FOREIGN KEY (cancelled_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_appointment_patient (patient_id),
    INDEX idx_appointment_doctor (doctor_id),
    INDEX idx_appointment_time (start_time, end_time),
    INDEX idx_appointment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recurring appointment patterns
CREATE TABLE recurring_appointment_patterns (
    id CHAR(36) PRIMARY KEY,
    frequency ENUM('daily', 'weekly', 'biweekly', 'monthly', 'custom') NOT NULL,
    days_of_week SET('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'),
    day_of_month TINYINT,
    interval_count INT DEFAULT 1, -- e.g., every 2 weeks
    start_date DATE NOT NULL,
    end_date DATE,
    end_after_occurrences INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointment notes
CREATE TABLE appointment_notes (
    id CHAR(36) PRIMARY KEY,
    appointment_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    note_type ENUM('pre_visit', 'during_visit', 'post_visit', 'administrative', 'private') NOT NULL,
    note_text TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE, -- if true, only visible to author
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_note_appointment (appointment_id),
    INDEX idx_note_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointment reminders
CREATE TABLE appointment_reminders (
    id CHAR(36) PRIMARY KEY,
    appointment_id CHAR(36) NOT NULL,
    reminder_type ENUM('email', 'sms', 'push', 'phone') NOT NULL,
    reminder_time DATETIME NOT NULL,
    status ENUM('pending', 'sent', 'failed', 'cancelled') NOT NULL DEFAULT 'pending',
    custom_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    INDEX idx_reminder_appointment (appointment_id),
    INDEX idx_reminder_time (reminder_time),
    INDEX idx_reminder_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
