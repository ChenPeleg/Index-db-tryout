
interface InfoDBStatus {
  statusType: string;
  statusDescription: string;
  statusIcon: string;
}
type StatusType = 'ok' | 'error' | 'connecting'
class StatusIndicator extends HTMLElement {
  private dbStatusInfo: Record<StatusType, InfoDBStatus> = {
    ok: {
      statusDescription: 'זמין',
      statusType: 'ok',
      statusIcon: 'ok'
    },
    connecting: {
      statusDescription: 'מתחבר',
      statusType: 'connecting',
      statusIcon: 'connecting'
    },
    error: {
      statusDescription: 'שגיאה',
      statusType: 'error',
      statusIcon: 'error'
    }
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const backgroundColor = '#bdb1fa';
    const shadowRoot: ShadowRoot = this.shadowRoot as ShadowRoot;
    shadowRoot.innerHTML = `
    
    <style>
      div.status-div{
        margin: 0px 20px;
        padding: 10px;
        background-color: ${backgroundColor};
        border-radius: 5px;
        display: inline-flex;
        width: 10vw;
        font-size: 17px;
        border: 2px solid grey;

      }

    </style>
    <div class="status-div">
    סטטוס
   : <slot> זמין </slot>
    </div>

    `

  }



}

customElements.define('status-indicator', StatusIndicator);
