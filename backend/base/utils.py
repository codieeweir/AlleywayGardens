from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six

class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        last_login = user.last_login.replace(microsecond=0, tzinfo=None) if user.last_login else ""
        return six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(last_login)

token_generator = AccountActivationTokenGenerator()