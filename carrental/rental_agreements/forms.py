from django import forms

class RejectionReasonForm(forms.Form):
    reason = forms.CharField(widget=forms.Textarea, label='Rejection Reason')
