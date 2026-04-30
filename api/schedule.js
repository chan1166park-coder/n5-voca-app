export default async function handler(req, res) {
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

        const { subId } = req.body;
          if (!subId) return res.status(400).json({ error: 'Missing subId' });

            const APP_ID = "6d233f88-93e6-40fa-af19-3ec8dfc38d34";
              const REST_API_KEY = "os_v2_app_nurt7cet4zapvlyzh3en7q4ngq7l2gr7tcausmv5iuh7hqulom6epsz3xcmfgpchksh32cjvucd5lvteu7apc2vegvlqv63dqwlc5ky";

                const getSendAfter = (minutes) => {
                    const d = new Date(Date.now() + minutes * 60000);
                        return d.toISOString().replace('T', ' ').substring(0, 19) + ' GMT+0000';
                          };

                            const schedules = [
                                { title: "⚡ 10분 복습 알림", msg: "방금 학습한 단어들의 1차 복습 타이밍입니다. 지금 바로 스키밍하세요!", delay: 10 },
                                    { title: "⏳ 2시간 복습 알림", msg: "2시간 전 학습한 단어들의 2차 복습 타이밍입니다. 기억이 흩어지기 전에 빠르게 스키밍하세요!", delay: 120 },
                                        { title: "💡 1일 복습 알림", msg: "어제 학습한 단어들의 3차 복습 타이밍입니다. 단기 기억을 장기 기억으로 넘기기 위해 스키밍하세요!", delay: 1440 },
                                            { title: "🧠 7일 복습 알림", msg: "일주일 전 학습한 단어들의 4차 복습 타이밍입니다. 잊지 않도록 가볍게 다시 한번 스키밍하세요!", delay: 10080 },
                                                { title: "🏆 30일 복습 알림", msg: "한 달 전 학습한 단어들의 최종 복습 타이밍입니다. 마지막 스키밍으로 완벽하게 마스터하세요!", delay: 43200 }
                                                  ];

                                                    try {
                                                        const promises = schedules.map(async schedule => {
                                                              const response = await fetch("https://onesignal.com/api/v1/notifications", {
                                                                      method: "POST",
                                                                              headers: {
                                                                                        "Content-Type": "application/json; charset=utf-8",
                                                                                                  "Authorization": `Basic ${REST_API_KEY}`
                                                                                                          },
                                                                                                                  body: JSON.stringify({
                                                                                                                            app_id: APP_ID,
                                                                                                                                      include_subscription_ids: [subId],
                                                                                                                                                headings: { "en": schedule.title, "ko": schedule.title },
                                                                                                                                                          contents: { "en": schedule.msg, "ko": schedule.msg },
                                                                                                                                                                    send_after: getSendAfter(schedule.delay)
                                                                                                                                                                            })
                                                                                                                                                                                  });
                                                                                                                                                                                        const data = await response.json();
                                                                                                                                                                                              console.log(`[${schedule.delay}분 예약 시도] 응답 상태: ${response.status}`, JSON.stringify(data));
                                                                                                                                                                                                    return data;
                                                                                                                                                                                                        });

                                                                                                                                                                                                            await Promise.all(promises);
                                                                                                                                                                                                                return res.status(200).json({ success: true });
                                                                                                                                                                                                                  } catch (error) {
                                                                                                                                                                                                                      console.error("서버 구동 에러:", error);
                                                                                                                                                                                                                          return res.status(500).json({ error: error.message });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                            
}