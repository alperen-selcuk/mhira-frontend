import { TableColumn } from '../../../@shared/@modules/master-data/@types/list';
import { Assessment, FormattedAssessment } from '@app/pages/assessment/@types/assessment';
import { environment } from '@env/environment';
import { User } from '@app/pages/user-management/@types/user';

export const AssessmentsPatientsTable: TableColumn<FormattedAssessment>[] = [
  {
    title: 'Başlık',
    name: 'formattedAssessmentType',
    altName: 'assessmentType',
    translationPath: 'tables.assessmentsPatients.title',
    // sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
    filterQuery: (q: number) =>
    q
      ? {
          or: [
            { name: { iLike: `%${q}%` } },
          ] as Array<{ [K in keyof Assessment]: any }>,
        }
      : {},
  },
  {
    title: 'Yönetici',
    name: 'formattedClinician',
    altName: 'clinician',
    translationPath: 'tables.assessmentsPatients.manager',
    sort: false,
    filterField: {
      type: 'text',
      value: undefined,
    },
    filterQuery: (q: number) =>
    q
      ? {
          or: [
            { firstName: { iLike: `%${q}%` } },
            { middleName: { iLike: `%${q}%` } },
            { lastName: { iLike: `%${q}%` } },
            { workID: { iLike: `%${q}%` } },
          ] as Array<{ [K in keyof User]: any }>,
        }
      : {},
  },
  // {
  //   title: 'Bilgi Verenler',
  //   name: 'informantType',
  //   translationPath: 'tables.assessmentsPatients.informant',
  //   sort: true,
  //   filterField: {
  //     type: 'text',
  //     value: undefined,
  //   },
  // },
  {
    name: 'formatedQuestionnaires',
    title: 'Anketler',
    render: 'questAvatar',
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Durum',
    name: 'formattedStatus',
    altName: 'status',
    translationPath: 'tables.assessmentsPatients.status',
    render: 'tag',
    sort: true,
    filterField: {
      type: 'select',
      value: undefined,
      // options added dynamically
    },
  },
  // {
  //   title: 'Son Geçerlilik Tarihi',
  //   altName: 'expirationDate',
  //   name: 'formatedExpirationDate',
  //   translationPath: 'tables.assessmentsPatients.expirationDate',
  //   sort: true,
  //   filterField: {
  //     type: 'dateRange',
  //     value: undefined,
  //     title: 'Son Geçerlilik Tarihi',
  //   },
  // },
  {
    name: 'submissionDate',
    title: 'Gönderim Tarihi',
    translationPath: 'plannedAssessments.submissionDate',
    render: 'date'
  },
  {
    title: 'E-posta Durumu',
    name: 'emailFormatedStatus',
    altName: 'emailStatus',
    render: 'tag',
    translationPath: 'tables.assessmentsPatients.emailStatus',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Teslim Tarihi',
    name: 'formatedDeliveryDate',
    altName: 'deliveryDate',
    translationPath: 'tables.assessmentsPatients.deliveryDate',
    sort: true,
    filterField: {
      type: 'dateRange',
      value: undefined,
      title: 'Teslim Tarihi',
    },
  },
];

if(!environment.email){
  AssessmentsPatientsTable.pop();
}
