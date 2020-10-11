import React from "react";
import { Icon } from "semantic-ui-react";
import HealthRatingBar from "../components/HealthRatingBar";
import { useStateValue } from "../state";
import { Entry, HealthCheckEntry } from "../types";

type SelectItemProps = {
  entry: Entry;
};

type EntryTypeIcons = "doctor" | "stethoscope" | "cog";

const nameEntryIconMap: Record<string, EntryTypeIcons> = {
  Hospital: "doctor",
  OccupationalHealthcare: "cog",
  HealthCheck: "stethoscope",
};

export const EntryItem: React.FC<SelectItemProps> = ({ entry }) => {
  const { date, description, diagnosisCodes, type } = entry;
  const [{ diagnoses }] = useStateValue();
  const baseInfo = () => (
    <>
      <div>
        {date} <Icon name={nameEntryIconMap[type]} />
      </div>
      <div>
        <i>{description}</i>
      </div>
      <div>
        {diagnosisCodes && diagnosisCodes.length && (
          <ul>
            {diagnosisCodes.map((c, i) => (
              <li key={i} >
                {c} {diagnoses[c]?.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  const healthCheckInfo = (entry: HealthCheckEntry) => (
    <>
      {baseInfo()}
      <div>
        <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      </div>
    </>
  );

  switch (entry.type) {
    case "Hospital":
      return baseInfo();
    case "HealthCheck":
      return healthCheckInfo(entry);
    case "OccupationalHealthcare":
      return baseInfo();
    default:
      break;
  }
  return null;
};
