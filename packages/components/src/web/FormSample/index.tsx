import { useForm } from "react-hook-form";
import { Button, Form, Input, FormItem, Radio, Checkbox } from "tera-dls";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  name: string;
  email: string;
  gender: string;
  birthday: Date;
  description: string;
  file: any[];
  hobby: any[];
  position: string;
};

const schema = yup
  .object()
  .shape({
    name: yup.string().required("Vui lòng nhập trường này!"),
    email: yup
      .string()
      .email("Email không hợp lệ!")
      .required("Vui lòng nhập trường này!"),
    hobby: yup.array().nullable(),
  })
  .required();

function Sample() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver<any>(schema),
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      position: null,
      description: "",
      hobby: [],
      file: [],
    },
  });

  const handleSubmitForm = (value) => {
    console.log("form value", value);
  };

  const handleResetForm = () => {
    reset();
  };

  return (
    <div className="form-sample ">
      <h1>Form Sample</h1>
      <Form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid grid-cols-2 gap-4">
          <FormItem
            isError={!!errors.name}
            messages={errors?.name?.message}
            label="Name:"
          >
            <Input
              {...register("name")}
              placeholder="Vui lòng nhập"
              className="w-full"
            />
          </FormItem>

          <FormItem
            label="Email:"
            isError={!!errors.email}
            messages={errors?.email?.message}
          >
            <Input
              {...register("email")}
              placeholder="Vui lòng nhập"
              className="w-full"
            />
          </FormItem>

          <FormItem
            label="Position:"
            className="col-span-2"
            isError={!!errors.position}
            messages={errors?.position?.message}
          >
            {/* <Select {...register('position')} placeholder="Vui lòng chọn">
              <Option value="FE">FE</Option>
              <Option value="BE">BE</Option>
              <Option value="BA">BA</Option>
              <Option value="DE">DE</Option>
              <Option value="other">Other</Option>
            </Select> */}
          </FormItem>

          <FormItem
            label="Gender:"
            isError={!!errors.gender}
            messages={errors?.gender?.message}
          >
            <Radio.Group {...register("gender")}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label="Hobby:"
            isError={!!errors.hobby}
            messages={errors?.hobby?.message}
          >
            <Checkbox.Group>
              <Checkbox {...register("hobby")} value="game">
                Game
              </Checkbox>
              <Checkbox {...register("hobby")} value="sports">
                Sports
              </Checkbox>
              <Checkbox {...register("hobby")} value="other">
                Other
              </Checkbox>
            </Checkbox.Group>
          </FormItem>
          <FormItem
            isError={!!errors.description}
            messages={errors?.description?.message}
            label="Description:"
            className="col-span-2"
          >
            <textarea {...register("description")} className="w-full border" />
          </FormItem>
          <FormItem
            label="Birthday:"
            isError={!!errors.birthday}
            messages={errors?.birthday?.message}
          >
            <input type="date" name="birthday" {...register("birthday")} />
          </FormItem>
          <FormItem
            label="File:"
            isError={!!errors.file}
            messages={errors?.file?.message}
          >
            <input
              type="file"
              name="file"
              {...register("file")}
              accept=""
              multiple
            />
          </FormItem>

          <div className="col-span-2 flex gap-2">
            <Button type="light" onClick={handleResetForm}>
              Reset
            </Button>
            <Button htmlType="submit">Submit</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Sample;
