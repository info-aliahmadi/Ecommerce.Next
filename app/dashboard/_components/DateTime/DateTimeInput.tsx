import { DateTimePicker, DatePicker, PickersActionBarAction } from '@mui/x-date-pickers';
import moment from 'moment-jalaali';
import nextIntlService from '@root/locales/nextIntlService';

interface DateTimeInputProps {
  name: string;
  label?: string;
  setFieldValue: (field: string, value: any) => void;
  defaultValue?: string | Date;
  error?: boolean;
  showTime?: boolean;
}

export default function DateTimeInput({
  name,
  label,
  setFieldValue,
  defaultValue,
  error,
  showTime = true,
}: Readonly<DateTimeInputProps>) {

  const currentLanguage = nextIntlService.getNextIntlLocale();

  return showTime ? (
    <DateTimePicker
      sx={{
        '& .MuiPickersSectionList-root': {
          padding: '10.5px 0',
          borderRadius: '7px'
        },
        '& .MuiPickersInputBase-root': {
          borderRadius: '8px'  // your desired radius
        }
      }}
      className={error === true ? 'date-error' : ''}
      name={name}
      format={currentLanguage === "fa" ? "jYYYY/jMM/jDD HH:mm" : "YYYY/MM/DD HH:mm"}
      label={label}
      value={defaultValue ? moment(defaultValue) : null}
      onChange={(value: moment.Moment | null) => {
        // if (!value) setFieldValue(name, null);
        setFieldValue(name, value);
        return value;
      }}
      slotProps={{
        actionBar: {
          actions: ['clear', 'today'] as PickersActionBarAction[],
        },
      }}
    />
  ) : (
    <DatePicker
      sx={{
        '& .MuiPickersSectionList-root': {
          padding: '10.5px 0',
          borderRadius: '7px'
        },
        '& .MuiPickersInputBase-root': {
          borderRadius: '8px'  // your desired radius
        }
      }}
      className={error === true ? 'date-error' : ''}
      name={name}
      label={label}
      format={currentLanguage === "fa" ? "jYYYY/jMM/jDD" : "YYYY/MM/DD"}
      value={defaultValue ? moment(defaultValue) : null}
      onChange={(value: moment.Moment | null) => {
        let selectedDate = value ? moment(value) : '';
        setFieldValue(name, selectedDate);
        return selectedDate;
      }}

      slotProps={{
        actionBar: {
          actions: ['clear', 'today'] as PickersActionBarAction[]
        },
      }}
    />
  );
}
