// Jednoduchý pôdorys ako overlay: obrázok + body miestností.
// VIEW: klik na bod = prechod do miestnosti, aktuálna miestnosť je zvýraznená.
// EDIT: klik kamkoľvek do pôdorysu = nastaví pozíciu aktuálnej miestnosti.

import { useRef } from 'react';

export default function FloorPlan({
  floorplan,
  baseUrl,
  currentNodeId,
  edit = false,
  onNavigate,
  onSetRoom,
}) {
  const imgWrapRef = useRef(null);

  if (!floorplan?.image) return null;

  const resolved = /^(https?:)?\/\//.test(floorplan.image) || floorplan.image.startsWith('/')
    ? floorplan.image
    : baseUrl + floorplan.image;

  function handlePlanClick(e) {
    if (!edit || !onSetRoom) return;
    // ignoruj kliky priamo na existujúce body
    if (e.target.closest('[data-room-dot]')) return;
    const rect = imgWrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onSetRoom(currentNodeId, x, y);
  }

  return (
    <div className={`ilumi-plan ${edit ? 'is-edit' : ''}`}>
      <div className="ilumi-plan__img" ref={imgWrapRef} onClick={handlePlanClick}>
        <img src={resolved} alt="Pôdorys" draggable={false} />
        {floorplan.rooms.map((room) => (
          <button
            key={room.nodeId}
            type="button"
            data-room-dot
            className={`ilumi-plan__dot ${room.nodeId === currentNodeId ? 'is-active' : ''}`}
            style={{ left: `${room.x * 100}%`, top: `${room.y * 100}%` }}
            title={room.label || room.nodeId}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(room.nodeId);
            }}
          >
            <span className="ilumi-plan__dot-label">{room.label || room.nodeId}</span>
          </button>
        ))}
      </div>
      {edit && (
        <p className="ilumi-plan__hint">
          Klikni do pôdorysu = umiestniš sem aktuálnu miestnosť ({currentNodeId})
        </p>
      )}
    </div>
  );
}
