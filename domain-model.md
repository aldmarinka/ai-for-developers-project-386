1. Владелец (Owner)
   - id: integer
   - name: string
Это единый профиль, под которым работает админская часть.

2. Тип события (EventType)
    - id: integer
    - name: string
    - description: string
    - duration: integer (minutes)

3. Слот: (Slot)
    - id: integer
    - datetime: date-time
    - is_available: boolean
   
- Бронирование: (Booking)
    - id: integer
    - slot_id: integer
    - event_type_id: integer
    - guest_name: string
    - guest_email: string



Текстовое описание публичного сценария гостя:
1. Гость открывает страницу и видит список всех типов событий (название, описание, длительность).
2. Гость выбирает тип события.
3. Система показывает календарь/сетку свободных слотов на ближайшие 14 дней (с учётом занятости всех типов событий).
4. Гость выбирает свободный слот.
5. Гость вводит имя и email, подтверждает бронирование.
6. Система создаёт бронирование, слот помечается занятым.