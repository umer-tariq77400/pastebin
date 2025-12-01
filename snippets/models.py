from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name
import uuid

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLES = sorted((item, item) for item in get_all_styles())

class Snippet(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    code = models.TextField()
    linenos = models.BooleanField(default=False)
    language = models.CharField(choices=LANGUAGE_CHOICES, default='python', max_length=100)
    style = models.CharField(choices=STYLES, default='colorful', max_length=100)
    owner = models.ForeignKey('auth.User', related_name='snippets', on_delete=models.CASCADE)
    highlighted = models.TextField()

    # New fields for sharing
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    shared_password = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        ordering = ['created']

    def save(self, *args, **kwargs):    
        lexer = get_lexer_by_name(self.language)
        formatter = HtmlFormatter(style=self.style, linenos=self.linenos)
        self.highlighted = highlight(self.code, lexer, formatter)
        if not self.uuid:
            self.uuid = uuid.uuid4()
        super().save(*args, **kwargs)
