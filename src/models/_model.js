module.exports = (config) => {
  /*
   *  GUARD
   */
  function _guard(config) {
    return (record) => {
      if (Array.isArray(config.guarded)) {
        for (const field of config.guarded) {
          delete record[field]
        }
      }
      return record
    }
  }

  /*
   *  POPULATE
   */
  function _populate(config) {
    return (data) => {
      let output = {}
      if (config.schema && config.schema.properties) {
        for (const field of Object.keys(config.schema.properties)) {
          let prop = config.schema.properties[field]
          let val = data[field]
          // only include properties from the data variable that
          // a) exist in the schema properties list, and
          // b) are assigned a value (skip undefined values)
          if (typeof val != 'undefined') {
            if (prop.type == 'integer') {
              val = parseInt(val, 10) || 0
            }
            if (prop.type == 'number') {
              val = parseFloat(val, 10) || 0
            }
            if (prop.type == 'string' && !prop.format) {
              val = String(val)
            }
            if (prop.format == 'date-time') {
              val = moment(val) || null
            }
            output[field] = val
          }
        }
      } else {
        output = data
      }

      return output
    }
  }

  /*
   *  CREATE
   */
  function _create(config) {
    const populate = _populate(config)
    const guard = _guard(config)

    return async (data) => {
      const record = populate(data)
      delete record.id
      record.created_at = new Date()

      // write the new record and return the guarded value of it
      const newId = await config
        .knex(config.tablename)
        .insert(record)
        .returning('id')
      const newRecord = await config
        .knex(config.tablename)
        .where({ id: newId[0] })
        .first()
      return guard(newRecord)
    }
  }

  /*
   *  FIND
   */
  function _find(config) {
    const guard = _guard(config)

    return async (conditions) => {
      const criteria = {}
      // discard conditions that do not match the schema
      for (const field of Object.keys(config.schema.properties)) {
        if (typeof conditions[field] !== 'undefined') {
          criteria[field] = conditions[field]
        }
      }
      // get the data
      let records = await config.knex(config.tablename).where(criteria)
      return records.map((row) => guard(row))
    }
  }

  /*
   *  FINDBYID
   */
  function _findById(config) {
    const guard = _guard(config)

    return async (target) => {
      const criteria = {}

      // get the data
      let record = await config
        .knex(config.tablename)
        .where({ id: target })
        .first()
      return guard(record)
    }
  }

  /*
   *  UPDATE
   */
  function _update(config) {
    const populate = _populate(config)
    const guard = _guard(config)

    return async (newData, transaction) => {
      if (typeof newData.id == 'undefined') {
        throw new Error(`Record ID not specified`)
      }

      let record = populate(newData)
      delete record.id
      delete record.created_at
      record.updated_at = new Date()
      await config
        .knex(config.tablename)
        .where({ id: newData.id })
        .update(record)
      const updatedRecord = await config
        .knex(config.tablename)
        .where({ id: newData.id })
        .first()
      if (!updatedRecord || !updatedRecord.id) {
        return {}
      }

      return guard(updatedRecord)
    }
  }

  /*
   *  REMOVE
   */
  function _remove(config) {
    const guard = _guard(config)

    return async (target) => {
      let record = await config
        .knex(config.tablename)
        .where({ id: target })
        .first()
      await config.knex(config.tablename).where({ id: target }).del()
      return guard(record)
    }
  }

  // create the output object
  const output = {}

  // add the read only properties
  Object.defineProperty(output, '_tablename', {
    value: config.tablename,
    writeable: false,
  })
  Object.defineProperty(output, '_schema', {
    value: config.schema,
    writeable: false,
  })
  Object.defineProperty(output, '_guarded', {
    value: config.guarded,
    writeable: false,
  })

  // add the public methods that can be over written
  output.guard = _guard(config)
  output.populate = _populate(config)
  output.create = _create(config)
  output.find = _find(config)
  output.findById = _findById(config)
  output.update = _update(config)
  output.remove = _remove(config)

  return output
}
