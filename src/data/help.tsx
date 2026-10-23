// Contenido del centro de ayuda ("Servicio de asistencia rápida").
// Texto entregado por la tienda; editar aquí para actualizar políticas.
import Link from "next/link";
import { SIZE_CHART } from "@/data/sizes";
import { site } from "@/config/site";
import { formatCOP } from "@/lib/utils";

export type HelpQuestion = { q: string; a: React.ReactNode };
export type HelpSection = { slug: string; title: string; questions: HelpQuestion[] };

const wa = `https://wa.me/${site.whatsapp}`;
const WhatsAppLink = ({ children = "nuestra línea de WhatsApp" }: { children?: React.ReactNode }) => (
  <a href={wa} target="_blank" rel="noreferrer">
    {children}
  </a>
);

export const helpSections: HelpSection[] = [
  {
    slug: "envios",
    title: "Envío y entrega",
    questions: [
      {
        q: "¿Cuánto tardará en llegar mi pedido?",
        a: (
          <p>
            Una vez que tu pago haya sido confirmado y nuestro almacén termine la preparación de tu pedido, recibirás la confirmación con
            tu número de guía de seguimiento. A partir de ese momento realizaremos la entrega en la dirección registrada en la orden en un
            estimado de {site.shipping.eta}.
          </p>
        ),
      },
      {
        q: `¿Cómo puedo obtener envío gratis en los pedidos de ${site.name}?`,
        a: (
          <>
            <p>Ofrecemos envío gratis para compras superiores a {formatCOP(site.shipping.freeFrom)}.</p>
            <p>
              Para acceder a este beneficio, el total de los productos comprados en la página web debe ser mínimo de{" "}
              {formatCOP(site.shipping.freeFrom)} (pesos colombianos). El beneficio se aplica automáticamente en el carrito de compras.
            </p>
            <p className="text-sm text-stone">
              El monto mínimo para la exención del valor del envío está sujeto a cambios. En cualquier caso, te avisaremos si cambia.
            </p>
          </>
        ),
      },
      {
        q: "¿Dónde puedo encontrar la fecha de entrega?",
        a: (
          <p>
            Puedes comprobar el estado de tu pedido y hacerle seguimiento con la guía que te proporcionamos. Además, al momento de realizar la
            compra se indica el periodo en el cual será entregado.
          </p>
        ),
      },
      {
        q: "¿Por qué mi pedido está retrasado?",
        a: (
          <p>
            Hacemos todo lo posible por entregar tu pedido a tiempo, pero en ocasiones, por circunstancias ajenas a la compañía, puede tomar
            un poco más. Una vez enviado, tu paquete podría retrasarse por condiciones climáticas adversas, una dirección de entrega
            incompleta o retrasos del servicio regional.
          </p>
        ),
      },
      {
        q: "¿Qué debo hacer si mi pedido aparece como entregado, pero no lo he recibido?",
        a: (
          <p>
            A veces la información de seguimiento del transportista se actualiza antes de tiempo, por lo que tu paquete podría entregarse en
            un plazo de 24 horas. Si todavía no es la fecha estimada, ten paciencia: tu paquete está en camino. Si ya pasó la fecha estimada,
            puedes comunicarte con nosotros para obtener ayuda en <WhatsAppLink>la línea de servicio al cliente</WhatsAppLink>.
          </p>
        ),
      },
    ],
  },
  {
    slug: "pedidos",
    title: "Pedidos",
    questions: [
      {
        q: "¿Dónde está mi pedido?",
        a: (
          <>
            <p>Recuerda que puedes realizar el seguimiento de tu pedido.</p>
            <p>
              Una vez despachado tu pedido, recibirás una guía con un código de rastreo. Puedes copiar y pegar ese código en el sitio web de
              la transportadora.
            </p>
            <p className="text-sm text-stone">
              Debes esperar a que nuestro almacén prepare tu pedido para poder ver la guía de envío y validar el estado de tu entrega en el
              sitio de nuestros socios logísticos.
            </p>
          </>
        ),
      },
      {
        q: "¿Dónde puedo encontrar el número de seguimiento?",
        a: <p>Cuando se envíe tu pedido, te enviaremos una guía con el número de seguimiento del transportista.</p>,
      },
      {
        q: "¿Por qué la información de seguimiento no se ha actualizado?",
        a: (
          <p>
            No te preocupes si la información de seguimiento no aparece de inmediato: al transportista puede tomarle hasta 48 horas
            activarla. Vuelve a consultar, se actualizará pronto.
          </p>
        ),
      },
      {
        q: "¿Puedo cambiar la dirección de entrega de mi pedido?",
        a: (
          <p>
            No. Nuestro equipo se apresura en procesar y enviar tu pedido lo antes posible, por eso no podemos cambiar el pedido ni la
            dirección de entrega.
          </p>
        ),
      },
    ],
  },
  {
    slug: "producto",
    title: "Información del producto",
    questions: [
      {
        q: "¿Cómo encuentro la talla y el ajuste adecuados?",
        a: (
          <>
            <p>Te ayudaremos a encontrar el calzado y el equipo adecuados en la talla adecuada para que puedas darlo todo.</p>
            <p>
              ¿No estás seguro de qué talla de sneakers usas? Nuestras tablas de tallas pueden ayudarte a determinar el mejor ajuste para todo
              nuestro calzado. En la tienda manejamos tallas europeas (EU): mujer de la 36 a la 39 y hombre de la 40 a la 44.
            </p>
            <p className="font-medium">Consejos: cómo tomar las medidas del largo del pie</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Pega con cinta adhesiva un trozo de papel a la superficie plana y dura, asegurándote de que el papel no se resbale.</li>
              <li>
                Párate sobre el papel con los pies separados a la altura de los hombros y el peso equilibrado de manera uniforme (solo un pie
                debe estar sobre el papel).
              </li>
              <li>
                Con un bolígrafo o lápiz apuntando hacia abajo, pide a un amigo o compañero que te ayude a marcar la punta del dedo gordo y la
                parte más externa del talón.
              </li>
              <li>
                Una vez hechas las marcas, retírate del papel y usa una regla o cinta métrica para medir la distancia entre los dos puntos. Esta
                medida representa la longitud del pie.
              </li>
              <li>
                Repite el proceso con el otro pie. Ten en cuenta que es común que el largo de un pie sea ligeramente diferente al del otro.
              </li>
              <li>
                Aplica la medida más larga de las dos a nuestra tabla de tallas para encontrar la talla adecuada para el largo de pie
                registrado. Si la medida está entre tallas, recomendamos elegir la talla más grande.
              </li>
            </ol>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[20rem] text-left text-sm tabular-nums">
                <caption className="sr-only">Equivalencias de tallas (la tienda usa tallas EU)</caption>
                <thead>
                  <tr className="border-b border-line text-stone">
                    <th scope="col" className="py-2 font-normal">EU</th>
                    <th scope="col" className="py-2 font-normal">US</th>
                    <th scope="col" className="py-2 font-normal">Colombia</th>
                    <th scope="col" className="py-2 font-normal">Pie (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {SIZE_CHART.map((s) => (
                    <tr key={s.eu}>
                      <th scope="row" className="py-2 font-medium">{s.eu}</th>
                      <td className="py-2">{s.us}</td>
                      <td className="py-2">{s.co}</td>
                      <td className="py-2">{s.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>Y recuerda, si el ajuste no es correcto, las devoluciones son fáciles.</p>
          </>
        ),
      },
      {
        q: "¿Tienen garantía los sneakers?",
        a: (
          <p>
            Sí. Nos hacemos responsables de la garantía legal de todos nuestros productos por defectos de fábrica o de materiales, hasta
            quince (15) días calendario desde la entrega. Consulta el proceso en <Link href="/ayuda?seccion=devoluciones">Garantías y devoluciones</Link>.
          </p>
        ),
      },
    ],
  },
  {
    slug: "devoluciones",
    title: "Garantías y devoluciones",
    questions: [
      {
        q: "Garantía de los productos",
        a: (
          <>
            <p>
              Si tus sneakers tienen un defecto de fábrica o de materiales relacionado con la calidad, idoneidad o seguridad del producto,
              queremos corregirlo y que vuelvas a usarlos cuanto antes. Nos hacemos responsables de la garantía legal de todos nuestros
              productos.
            </p>
            <p>
              Si tu producto presenta defectos o fallas y han pasado menos de quince (15) días calendario desde que recibiste tu compra en
              {` ${site.name}`}, solo tienes que devolverlo con nuestros aliados logísticos autorizados para realizar el proceso de
              verificación en virtud de la garantía legal.
            </p>
            <p>Solo tienes que seguir los pasos indicados a continuación para devolver tu pedido:</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Envíanos una foto de tus sneakers a <WhatsAppLink /> para verificar el artículo. Si no cumple los requisitos de devolución,
                te los enviamos de nuevo a la dirección que proporcionaste.
              </li>
              <li>Si la devolución es aprobada, te solicitaremos tu información y datos para realizarla.</li>
              <li>Empaca el artículo de forma segura y adjunta la etiqueta de devolución (número de guía).</li>
              <li>Lleva el paquete a la transportadora aliada autorizada más cercana con la etiqueta impresa o visible en tu celular.</li>
            </ol>
            <p className="font-medium">
              En ningún caso y bajo ningún motivo {site.name} se hará responsable por la garantía legal en los siguientes casos:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Fuerza mayor o caso fortuito.</li>
              <li>El hecho de un tercero.</li>
              <li>El uso indebido del producto por parte del consumidor.</li>
              <li>Que el consumidor no haya atendido las instrucciones de cuidado, lavado y mantenimiento.</li>
              <li>Arrugas en el calzado causadas por el uso normal o por la flexión del empeine.</li>
              <li>Manchas o decoloración causadas por un mal procedimiento de lavado.</li>
              <li>Daños causados por remover las etiquetas internas del producto.</li>
            </ul>
          </>
        ),
      },
      {
        q: "Política de pedidos",
        a: (
          <p>
            Si tus sneakers presentan un defecto de fábrica o de materiales, tienes hasta quince (15) días calendario a partir de la fecha de
            entrega para hacer efectiva la garantía legal.
          </p>
        ),
      },
    ],
  },
  {
    slug: "pagos",
    title: "Opciones de pago",
    questions: [
      {
        q: "¿Qué medios de pago aceptan?",
        a: (
          <p>
            Pagas de forma segura a través de Wompi con tarjeta de crédito o débito, PSE o Nequi. El pago se confirma en línea y te avisamos
            en cuanto tu pedido quede aprobado.
          </p>
        ),
      },
    ],
  },
];
