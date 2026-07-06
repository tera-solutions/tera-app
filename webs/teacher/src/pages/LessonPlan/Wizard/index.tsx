import { useParams } from "react-router-dom";

import CreateWizard from "./CreateWizard";
import EditWizard from "./EditWizard";

const LessonPlanWizard = () => {
  const { id } = useParams<{ id?: string }>();

  if (id) return <EditWizard planId={Number(id)} />;
  return <CreateWizard />;
};

export default LessonPlanWizard;
