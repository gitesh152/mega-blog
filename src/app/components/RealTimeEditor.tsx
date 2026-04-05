import { Editor } from "@tinymce/tinymce-react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import conf from "../../conf/conf";

type RTEProps<T extends FieldValues> = {
  readonly name: Path<T>;
  readonly control: Control<T>;
  readonly label: string;
  readonly defaultValue?: string;
};

function RTE<T extends FieldValues>({
  name,
  control,
  label,
  defaultValue = "",
}: RTEProps<T>) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 inline-block pl-1 text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}

      <Controller // Pass control to parent
        name={name}
        control={control} // property to be passed from parent to Controller.
        render={(
          // How we render things in Controller
          { field: { onChange } },
        ) => (
          <Editor // Editor from tinymce
            apiKey={conf.tinymceApiKey}
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic underline strikethrough subscript superscript | forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",

              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}

export default RTE;
