from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import RentalAgreement
from .forms import RejectionReasonForm  
from django.urls import path



@admin.register(RentalAgreement)
class RentalAgreementAdmin(admin.ModelAdmin):
    list_display = ['reservation', 'status', 'download_agreement_link']
    actions = ['accept_agreements']

    def download_agreement_link(self, obj):
        return format_html(f"<a href='{obj.agreement_file.url}' download>Download</a>")
    download_agreement_link.short_description = 'Agreement'

    def accept_agreements(self, request, queryset):
        queryset.update(status='accepted')
        # Logic to notify the user about acceptance
    accept_agreements.short_description = 'Accept selected agreements'

    def reject_agreements(self, request, queryset):
        if 'apply' in request.POST:
            form = RejectionReasonForm(request.POST)
            if form.is_valid():
                reason = form.cleaned_data['reason']
                queryset.update(status='rejected', rejection_reason=reason)
                # Logic to notify the user about rejection with the reason
                self.message_user(request, "Selected agreements have been rejected.")
                return HttpResponseRedirect(request.get_full_path())
        else:
            form = RejectionReasonForm()

        return render(request, 'admin/agreement_rejection_reason.html', {'form': form, 'agreements': queryset})
    reject_agreements.short_description = 'Reject selected agreements'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('reject_agreements/', self.admin_site.admin_view(self.reject_agreements), name='reject_agreements'),
        ]
        return custom_urls + urls
