"""
Custom validators for user security in WellSphere
"""

import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from datetime import date


class ComplexityPasswordValidator:
    """
    Validate that the password meets healthcare-standard complexity requirements:
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    - No common patterns like sequential characters
    """
    
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter."),
                code='password_no_upper',
            )
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter."),
                code='password_no_lower',
            )
        if not re.search(r'[0-9]', password):
            raise ValidationError(
                _("Password must contain at least one digit."),
                code='password_no_digit',
            )
        if not re.search(r'[^A-Za-z0-9]', password):
            raise ValidationError(
                _("Password must contain at least one special character."),
                code='password_no_special',
            )
            
        # Check for common sequential patterns
        common_sequences = [
            '12345', '23456', '34567', '45678', '56789', '67890',
            'qwerty', 'asdfgh', 'zxcvbn', 'abcdef',
            'password', 'admin', 'welcome', 'letmein'
        ]
        
        password_lower = password.lower()
        for sequence in common_sequences:
            if sequence in password_lower:
                raise ValidationError(
                    _("Password contains a common sequence."),
                    code='password_common_sequence',
                )

    def get_help_text(self):
        return _(
            "Your password must contain at least one uppercase letter, "
            "one lowercase letter, one digit, and one special character. "
            "It should not contain common sequences or patterns."
        )


def validate_phone_number(value):
    """
    Validate that the phone number is in a valid format.
    """
    if not value:
        return
    
    # Remove common formatting characters
    cleaned = re.sub(r'[\s\-\(\)]+', '', value)
    
    # Check if it matches a basic phone pattern
    if not re.match(r'^\+?[0-9]{10,15}$', cleaned):
        raise ValidationError(
            _('Enter a valid phone number (e.g., +1 555-123-4567 or 555-123-4567).')
        )


def validate_date_of_birth(value):
    """
    Validate that the date of birth is not in the future and not too far in the past.
    """
    if not value:
        return
    
    today = date.today()
    
    if value > today:
        raise ValidationError(
            _('Date of birth cannot be in the future.')
        )
    
    # Check if the person is not too old (e.g., 120 years)
    max_age = 120
    min_date = date(today.year - max_age, today.month, today.day)
    
    if value < min_date:
        raise ValidationError(
            _('Date of birth indicates an age over %(max_age)s years.'),
            params={'max_age': max_age},
        )
