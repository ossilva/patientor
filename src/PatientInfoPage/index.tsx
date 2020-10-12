import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Icon } from "semantic-ui-react";

import { Entry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import {
  useStateValue,
  setSelectedPatient,
  addNewPatient,
} from "../state";
import { EntryItem } from "./EntryItem";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientListPage: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };
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

  const submitNewEntry = async (values: EntryFormValues) => {
    if (selectedPatient) {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${selectedPatient.id}/entries`,
        values
      );
      const updatedPatient = { ...selectedPatient, entries: [...selectedPatient.entries, newEntry] };
      dispatch(addNewPatient(updatedPatient));
      dispatch(setSelectedPatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
    }
  };




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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  ) : (
    <div>loading...</div>
  );
};

export default PatientListPage;
