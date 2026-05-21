import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Chip, FormControl, MenuItem, OutlinedInput, Select, useTheme, Theme } from '@mui/material';
import { Box } from '@mui/system';
import TopicsService from '@dashboard/(cms)/_service/TopicService';
import { useSession } from 'next-auth/react';

export default function SelectTopic({ defaultValues, id, setFieldValue, error, disabled = false }:
  Readonly<{
    defaultValues: number[],
    id?: string,
    setFieldValue?: any,
    error?: boolean,
    disabled?: boolean
  }>) {
  const t = useTranslations("");
  const { data: session } = useSession();
  const jwt = session?.accessToken;

  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);
  const [values, setValues] = useState<Option[]>([]);
  const topicService = new TopicsService(jwt ?? '');

  const loadTopics = () => {
    topicService.getTopicListForSelect().then((result) => {
      const optionsData: Option[] = result.data?.map((x) => ({ id: x.id, name: x.title })) as Option[];
      setOptions(optionsData);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    let dValues = options?.filter((x) => defaultValues?.find((c) => c === x.id))
    setValues(dValues);
  }, [JSON.stringify(defaultValues)]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };
  function getStyles(value: Option, values: Option[], theme: Theme) {
    return {
      fontWeight: values.indexOf(value) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
  }

  const handleChange = (event: any) => {
    setFieldValue(id, event.target.value);
    setValues(event.target.value);
  };

  return (
    <FormControl error={error} disabled={disabled}>
      <Select
        id={id}
        className="select-topic"
        // key={id + loading + defaultValues}
        multiple
        value={values || []}
        label={''}
        size="small"
        onChange={handleChange}
        MenuProps={MenuProps}
        input={<OutlinedInput label={t('pages.topics')} />}
        defaultValue={options?.filter((x) => defaultValues?.find((c) => c === x.id)) ?? []}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value, index) => {
              let title = options?.find((x) => x.id == value.id)?.name;
              return <Chip key={'chip-' + index} label={title} />;
            })}
          </Box>
        )}
      >
        {options?.map((item) => {
          return (
            <MenuItem key={'menu-' + item.id} value={item.id} style={getStyles(item, values, theme)}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{item.name}</span>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
