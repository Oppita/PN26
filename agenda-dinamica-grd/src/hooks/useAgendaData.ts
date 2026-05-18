// Fetch initial data from Supabase
useEffect(() => {

  const fetchUserData = async () => {

    try {

      const supabase = getSupabase();

      console.log("🚀 Conectando con Supabase...");

      // =========================
      // REGISTRATIONS
      // =========================

      if (user) {

        const {
          data: regData,
          error: regError
        } = await supabase
          .from('registrations')
          .select('talk_id')
          .eq('user_id', user.id);

        console.log("📌 REGISTRATIONS:", regData);
        console.log("❌ REGISTRATIONS ERROR:", regError);

        if (!regError && regData) {

          const apiRegistrations = new Set<string>(
            regData.map(r => r.talk_id)
          );

          setRegistrations(apiRegistrations);

        }

      }

      // =========================
      // TALKS
      // =========================

      const {
        data: talksData,
        error: talksError
      } = await supabase
        .from('talks')
        .select('*');

      console.log("📦 SUPABASE TALKS:", talksData);
      console.log("❌ TALKS ERROR:", talksError);
      console.log("📊 TOTAL TALKS:", talksData?.length);

      // =========================================================
      // SI SUPABASE YA TIENE TODAS LAS SESIONES
      // =========================================================

      if (
        !talksError &&
        talksData &&
        talksData.length >= INITIAL_EVENTS.length
      ) {

        console.log("✅ Cargando datos desde Supabase");

        const mappedTalks = talksData.map((t: any) => ({

          id: t.id,

          title: t.title,

          description: t.description || '',

          startTime: t.start_time || t.startTime,

          endTime: t.end_time || t.endTime,

          roomId: t.room_id || t.roomId,

          type: t.type || 'Sesión paralela y temática',

          themeTag: t.theme_tag || t.themeTag,

          speakers: t.speakers
            ? (
                typeof t.speakers === 'string'
                  ? JSON.parse(t.speakers)
                  : t.speakers
              )
            : [],

          registeredCount:
            t.registered_count ||
            t.registeredCount ||
            0,

          capacity: t.capacity || 100,

          organizers: t.organizers || [],

          moderators: t.moderators || [],

          summary: t.summary || '',

          objective: t.objective || ''

        })) as AgendaEvent[];

        setEventsData(mappedTalks);

      }

      // =========================================================
      // SI SUPABASE ESTÁ VACÍO O INCOMPLETO
      // =========================================================

      else {

        console.warn(
          "⚠️ Supabase vacío o incompleto. Subiendo INITIAL_EVENTS..."
        );

        setEventsData(INITIAL_EVENTS);

        try {

          const formattedTalks = INITIAL_EVENTS.map(e => ({

            id: e.id,

            title: e.title,

            description: e.description,

            start_time: e.startTime,

            end_time: e.endTime,

            room_id: e.roomId,

            type: e.type,

            theme_tag: e.themeTag,

            speakers: e.speakers,

            registered_count:
              e.registeredCount || 0,

            capacity:
              e.capacity || 100

          }));

          const { error: upsertError } = await supabase
            .from('talks')
            .upsert(formattedTalks);

          console.log("✅ UPSERT COMPLETADO");
          console.log("❌ UPSERT ERROR:", upsertError);

        } catch (err) {

          console.error(
            '❌ Failed to sync INITIAL_EVENTS',
            err
          );

        }

      }

    } catch (err) {

      console.error(
        '❌ Failed to fetch from Supabase',
        err
      );

    } finally {

      setLoadingInitial(false);

    }

  };

  fetchUserData();

}, [user]);
