// PrivacyPolicyModal.js
import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// ⬇️ change this path to where your CustomText actually is
import CustomText from '../components/CustomText';

const PRIVACY_POLICY_TEXT = `CONTENT RESPONSIBILITY & PRIVACY POLICY 

SnapHive, LLC 
Effective Date: 11/14/2025 
Applies in the United States, Canada, the European Union, and the United Kingdom 

Shape 

1. Introduction 

SnapHive, LLC (“SnapHive,” “we,” “us,” or “our”) provides a platform (“Platform”) that enables event administrators and users (“Users”) to upload, share, and manage photos, videos, and other media (“User Content”). This Policy explains: 

Responsibilities and liabilities for User Content 

Privacy obligations under U.S., Canadian, EU, and UK law 

Roles under GDPR and PIPEDA (controller vs. processor) 

Special protections for minors and biometric information 

Consent and data processing requirements 

By using the Platform, Users agree to this Policy. 

Shape 

PART I — CONTENT RESPONSIBILITY FRAMEWORK 

2. SnapHive’s Role and Liability 

SnapHive acts solely as a technology service provider. 
SnapHive does not: 

Create User Content 

Review or pre-moderate User Content 

Verify consent for User Content 

Control distribution, participants, or event-level settings 

SnapHive is not liable for any User Content uploaded, shared, or viewed on the Platform. 

To the fullest extent lawful under: 

GDPR / UK GDPR 

ePrivacy Directive 

PIPEDA and Canadian provincial laws 

U.S. federal and state laws 

SnapHive disclaims all liability for User Content. 

Shape 

3. Responsibility of Event Administrators 

Event administrators act as data controllers for: 

The creation of events 

The admission and removal of participants 

The determination of what content is permitted 

All consent required for capturing or uploading media 

Any content involving minors, biometric data, or sensitive data 

Event administrators agree to: 

Only admit participants they trust 

Ensure that all required permissions are obtained 

Moderate and remove content as necessary 

Comply with all applicable privacy laws in their jurisdiction 

Bear full responsibility for all User Content uploaded within their event 

SnapHive is not responsible for event organization or participant behavior. 

Shape 

4. Responsibility of Individual Users 

Users acknowledge that they: 

Are the creators and controllers of their own User Content 

Have all necessary rights, permissions, and lawful bases to upload media 

Will not upload content involving minors without proper consent 

Will comply with copyright, privacy, and consent requirements 

Will indemnify SnapHive from claims related to their content 

Users are solely responsible for their own media files. 

Shape 

5. Auto-Upload and Automated Submission Features 

When Users or administrators enable auto-upload, they acknowledge that: 

Media may upload instantly without review 

They assume full responsibility for automatically uploaded content 

Auto-upload should only be used with trusted individuals 

SnapHive has no liability for media added automatically 

This includes obligations under: 

GDPR Articles 6, 7, 9 

PIPEDA principles of consent and accountability 

U.S. state privacy laws 

Shape 

PART II — PRIVACY & LEGAL COMPLIANCE 

6. GDPR, UK GDPR, and EU Privacy Compliance 

Under GDPR / UK GDPR: 

Event administrators and Users = Data Controllers 

SnapHive = Data Processor (only for hosting and platform operations) 

SnapHive processes personal data based on: 

Article 6(1)(b): performance of a contract (providing the Platform) 

Article 28: processor obligations 

Article 32: security safeguards 

SnapHive does not determine the purposes or means of User Content creation or upload. 

Shape 

7. Canadian Privacy Compliance (PIPEDA & Law 25) 

SnapHive complies with: 

PIPEDA (federal) 

Law 25 (Quebec) 

Alberta & British Columbia private-sector laws 

Event administrators and Users are responsible for: 

Lawful consent for photos/videos 

Notice of purposes 

Security and retention decisions for User Content 

Ensuring minors’ data is lawfully collected 

SnapHive acts only as a service provider / processor. 

Shape 

8. U.S. Privacy Compliance 

SnapHive adheres to applicable U.S. laws including: 

CCPA / CPRA (California) 

VCDPA (Virginia) 

CPA (Colorado) 

CTDPA (Connecticut) 

UCPA (Utah) 

Under these laws: 

Users and administrators determine the purposes of photo/video collection 

SnapHive functions as a service provider / processor 

Users must obtain all necessary consents before uploading data 

Shape 

9. Biometric Information (Photos, Videos, Identifiable Features) 

User Content may contain biometric identifiers or biometric-derived data (e.g., faces, voices, unique characteristics). 

SnapHive: 

Does not use facial recognition 

Does not extract biometric templates 

Does not analyze or process biometric identifiers 

Does not sell, share, or profile biometric data 

Users and administrators must obtain: 

Explicit consent where required (GDPR Art. 9, Law 25, CCPA/CPRA) 

Parental consent for minors 

Any model releases or permissions required by local law 

SnapHive bears no liability for biometric data uploaded by Users. 

Shape 

10. Consent Requirements 

Users and administrators must: 

Obtain all legally required consent before capturing or uploading media 

Ensure individuals are informed of the purpose of collection 

Comply with GDPR or PIPEDA consent standards where applicable 

Verify consent for minors before upload 

SnapHive does not verify consent and is not responsible for failures to obtain consent. 

Shape 

11. Minors 

Under GDPR, UK GDPR, COPPA (U.S.), and Canadian law: 

Parental/guardian consent is required before uploading media of minors 

Event administrators and Users are 100% responsible for verifying consent 

SnapHive is not liable for content involving minors 

SnapHive may remove content at its discretion but is not obligated to do so 

Shape 

12. International Transfers 

SnapHive may store and process data in the U.S. 

For EU/UK Users: 

Transfers rely on Standard Contractual Clauses (SCCs) 

Additional security measures are used to protect data 

Users acknowledge data may be processed outside the EEA 

Shape 

13. Data Subject Rights 

Under GDPR, UK GDPR, PIPEDA, and U.S. laws, Users may exercise rights such as: 

Access 

Rectification 

Erasure 

Objection 

Portability 

Withdrawal of consent 

SnapHive will forward such requests to the appropriate data controller (event administrator or User). 

Shape 

14. Reporting & Removal 

SnapHive may remove content that: 

Violates law 

Violates platform guidelines 

Presents legal or safety concerns 

However, SnapHive is not obligated to monitor or remove any User Content. 

Shape 

15. Limitation of Liability 

To the fullest extent permitted by global law: 

SnapHive, LLC is not liable for: 

User Content 

Consent failures 

Biometric data uploaded by Users 

Violations of law by Users or administrators 

Access or misuse of content by event participants 

Damages arising from User Content 

Users and administrators assume all risk and liability. 

Shape 

16. Acceptance 

By using the Platform, Users and administrators acknowledge: 

They read and agree to this Policy 

They assume full responsibility for User Content 

SnapHive is released from all liability related to User Content 
`;

const PrivacyPolicyModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {/* Close button */}
          <View style={styles.header}>
            <CustomText weight="medium" style={styles.title}>
              Privacy Policy
            </CustomText>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <CustomText style={styles.closeText}>✕</CustomText>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomText style={styles.policyText}>
              {PRIVACY_POLICY_TEXT}
            </CustomText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dark overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    maxHeight: '80%',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
  },
  closeText: {
    fontSize: 18,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PrivacyPolicyModal;
