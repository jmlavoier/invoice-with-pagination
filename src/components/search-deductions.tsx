import { Field, Input, Stack, VStack } from "@chakra-ui/react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react";

type SearchDeductionsProps = {
  onChange: (value: string) => void;
};

export const SearchDeductions = ({ onChange }: SearchDeductionsProps) => {
  const [value, setValue] = useState<string>("");
  const deferred = useDeferredValue(value);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    []
  );

  console.log("search: ", value, deferred);

  useEffect(() => {
    onChange(deferred);
  }, [deferred]);

  return (
    <VStack gap={2} width="full" alignItems="flex-start">
      <Stack>
        <Field.Root width="300px">
          <Field.Label fontWeight="semibold">SEARCH</Field.Label>
          <Input
            placeholder="Search by name"
            backgroundColor="white"
            value={value}
            onChange={handleChange}
          />
          <Field.HelperText />
          <Field.ErrorText />
        </Field.Root>
      </Stack>
    </VStack>
  );
};
