import Typography from '@mui/material/Typography';

interface CurrencyProps {
  readonly value: number;
  readonly currency: 'USD' | 'EUR' | 'GBP' | 'Rial' | 'Toman' | 'Dinar';
}

export default function Currency({value, currency}: CurrencyProps) {
  let result;

  let dollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let euro = Intl.NumberFormat('en-DE', {style: 'currency', currency: 'EUR'});
  let pounds = Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'});
  let dinar = Intl.NumberFormat('ar-IQ', {style: 'currency', currency: 'IQD'});
  let rial = new Intl.NumberFormat('fa-IRR');
  let toman = new Intl.NumberFormat('fa-IRT');

  switch (currency) {
    case 'USD': {
      result = dollar.format(value);
      break;
    }
    case 'EUR': {
      result = euro.format(value);
      break;
    }
    case 'GBP': {
      result = pounds.format(value);
      break;
    }
    case 'Rial': {
      result = `ریال${rial.format(value)}`;
      break;
    }
    case 'Toman': {
      result = `تومان${toman.format(value)}`;
      break;
    }
    case 'Dinar': {
      result = `IQD${dinar.format(value)}`;
      break;
    }
  }
  return <Typography>{result}</Typography>;
}
