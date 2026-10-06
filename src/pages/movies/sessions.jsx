import { useMemo } from "react";
import { useSearchParams } from "react-router";
import DayPicker from "../../components/ui/day-picker";
import SessionTicket from "../../components/ui/session-ticket";
import { useAuth } from "../../context/auth-context";
import useMovieSessions from "../../hooks/use-movie-sessions";
import { buildDays } from "../../utils/dates";

const DAYS_TO_SHOW = 7;

const groupByHall = (sessions) => {
  const halls = new Map();
  sessions.forEach((s) => {
    if (!halls.has(s.hall.id)) halls.set(s.hall.id, { hall: s.hall, sessions: [] });
    halls.get(s.hall.id).sessions.push(s);
  });
  return [...halls.values()];
};

export default function Sessions({ movie, onSelect }) {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const days = useMemo(() => buildDays(DAYS_TO_SHOW), []);
  const availableSet = useMemo(() => new Set(movie.availableDates ?? []), [movie]);
  const daysWithSessions = days.filter((d) => availableSet.has(d.iso)).length;

  // selected date lives in the URL (?date=YYYY-MM-DD); invalid or missing -> first available day
  const urlDate = searchParams.get("date");
  const selectedDate = availableSet.has(urlDate) ? urlDate : (days.find((d) => availableSet.has(d.iso))?.iso ?? null);

  const { venues, loading, error } = useMovieSessions(movie.slug, selectedDate, !movie.isComingSoon);

  // only a signed-in user can be too young; guests get the login modal on click
  const ageRestricted = user?.age != null && movie.ageRating && user.age < movie.ageRating.minAge;
  const totalSessions = venues.reduce((sum, v) => sum + v.sessions.length, 0);

  const selectDate = (iso) => setSearchParams({ date: iso }, { replace: true });

  return (
    <section className="movie-sessions">
      <h2 className="text-h2">Sessions</h2>

      {movie.isComingSoon ? (
        <p className="movie-sessions-note text-body-m">Sessions will be announced soon.</p>
      ) : (
        <>
          <p className="movie-sessions-subtitle text-body-s">{daysWithSessions} days with sessions in the next seven days</p>

          <DayPicker days={days} value={selectedDate} onChange={selectDate} isDisabled={(d) => !availableSet.has(d.iso)} />

          {loading && <p className="movie-sessions-note text-body-m">Loading sessions...</p>}
          {error && <p className="movie-sessions-note text-body-m">Couldn't load sessions. Please try again.</p>}
          {!loading && !error && totalSessions === 0 && <p className="movie-sessions-note text-body-m">No sessions on this date.</p>}

          {!loading &&
            venues.map(({ venue, sessions }) => (
              <div key={venue.id} className="venue">
                <h3 className="text-button">{venue.name}</h3>

                <div className="venue-halls">
                  {groupByHall(sessions).map(({ hall, sessions: hallSessions }) => (
                    <div key={hall.id} className="hall">
                      <h4 className="text-label-s">Hall {hall.name}</h4>
                      <div className="hall-sessions">
                        {hallSessions.map((s) => (
                          <SessionTicket
                            key={s.id}
                            session={s}
                            disabled={s.isSoldOut || ageRestricted}
                            title={ageRestricted ? movie.ageRating.description : undefined}
                            onClick={() => onSelect(s)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </>
      )}
    </section>
  );
}
