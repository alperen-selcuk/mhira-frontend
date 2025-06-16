import { FormattedUser } from '@app/pages/user-management/@types/formatted-user';
import { TableColumn } from '../../../@shared/@modules/master-data/@types/list';

export const CaseManagerColumns: TableColumn<FormattedUser>[] = [
  {
    title: 'Ad',
    name: 'firstName',
    translationPath: 'tables.casemanagers.firstName',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'İkinci Ad',
    name: 'middleName',
    translationPath: 'tables.casemanagers.middleName',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Soyad',
    name: 'lastName',
    translationPath: 'tables.casemanagers.lastName',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Çalışma Kimliği',
    name: 'workID',
    translationPath: 'tables.casemanagers.workID',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Telefon',
    name: 'phone',
    translationPath: 'tables.casemanagers.phone',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Kullanıcı Adı',
    name: 'username',
    translationPath: 'tables.casemanagers.username',
    sort: true,
    filterField: {
      type: 'text',
      value: undefined,
    },
  },
  {
    title: 'Departmanlar',
    name: 'formattedDepartments',
    translationPath: 'tables.casemanagers.username',
    altName: 'departments',
    render: 'tag',
    filterField: {
      type: 'select',
      value: undefined,
      // options will be added dynamically
    },
    filterQuery: (q: number) => ({ id: { eq: q } }),
  },
];
