import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Icon } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, setSelectedPatient } from "../state";
import { EntryItem } from "./EntryItem";

const PatientListPage: React.FC = () => {
  const [{ selectedPatient }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getPatient4Id = async (id: string) => {
      try {
        const { data: matchedPatient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setSelectedPatient(matchedPatient));
      } catch (e) {
        console.error(e.response.data);
        // setError(e.response.data.error);
      }
    };
    getPatient4Id(id);
  }, [dispatch, id]);
  // const [error, setError] = React.useState<string | undefined>();

  type GenderIcons = "mars" | "venus" | "other gender";

  const nameIconMap: Record<string, GenderIcons> = {
    male: "mars",
    female: "venus",
    other: "other gender",
  };

  return selectedPatient ? (
    <div className="App">
      <h1>
        {selectedPatient.name}
        <Icon name={nameIconMap[selectedPatient.gender]} />
      </h1>
      <p>ssn: {selectedPatient.ssn}</p>
      <p>occupation: {selectedPatient.occupation}</p>
      <div>
        <h2>entries</h2>
        {!!selectedPatient.entries.length && (
            selectedPatient.entries.map((e, i) => (
              <div className="entryInfo" key={i}>
                <EntryItem entry={e} key={i} />
              </div>
            ))
        )}
      </div>
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default PatientListPage;
